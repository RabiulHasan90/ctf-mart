const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find()
			.populate("user")
			.populate("items.product");

		res.status(200).json({
			success: true,
			count: orders.length,
			orders,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({ user: req.user.id }).populate(
			"items.product",
		);

		// Include privateData for user's own orders (they've purchased these products)
		const ordersWithPrivateData = orders.map((order) => {
			const orderObj = order.toObject();
			// privateData is already included in populated products for purchased items
			return orderObj;
		});

		res.status(200).json({
			success: true,
			count: orders.length,
			orders: ordersWithPrivateData,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id)
			.populate("user")
			.populate("items.product");

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		// Make sure user is order owner
		if (
			order.user._id.toString() !== req.user.id &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to view this order",
			});
		}

		res.status(200).json({
			success: true,
			order,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
// VULNERABILITY: The order is completed without checking payment status!
// Users can place an order and skip payment, still getting the products
exports.createOrder = async (req, res, next) => {
	try {
		const { items, shippingAddress } = req.body;

		if (!items || items.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "Please provide items" });
		}

		if (!shippingAddress) {
			return res.status(400).json({
				success: false,
				message: "Please provide shipping address",
			});
		}

		// Calculate total price
		let totalPrice = 0;
		const orderItems = [];

		for (const item of items) {
			if (!item.productId) {
				return res.status(400).json({
					success: false,
					message: "Invalid product ID in cart",
				});
			}

			const product = await Product.findById(item.productId);

			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product ${item.productId} not found`,
				});
			}

			if (product.stock < item.quantity) {
				return res.status(400).json({
					success: false,
					message: `Not enough stock for ${product.name}`,
				});
			}

			totalPrice += product.price * item.quantity;

			orderItems.push({
				product: product._id,
				quantity: item.quantity,
				price: product.price,
			});

			// Reduce stock
			product.stock -= item.quantity;
			await product.save();
		}

		// Get user
		const user = await User.findById(req.user.id);

		// Verify payment: Check if user has enough balance
		if (user.totalBalance < totalPrice) {
			return res.status(400).json({
				success: false,
				message: `Insufficient balance. Your balance: $${user.totalBalance.toFixed(2)}, Required: $${totalPrice.toFixed(2)}`,
				userBalance: user.totalBalance,
				requiredAmount: totalPrice,
			});
		}

		// Process payment: Deduct from user balance
		user.totalBalance -= totalPrice;
		await user.save();

		// Create order only after payment is verified and processed
		const order = new Order({
			user: req.user.id,
			items: orderItems,
			totalPrice: totalPrice,
			shippingAddress: shippingAddress,
			paymentStatus: "completed", // Payment verified and completed
			orderStatus: "processing", // Order is processing after successful payment
		});

		await order.save();

		await user.save();

		// Populate before sending response
		const populatedOrder = await Order.findById(order._id).populate(
			"items.product",
		);

		res.status(201).json({
			success: true,
			message:
				"Order placed successfully! Payment verified and processed.",
			order: populatedOrder,
			userBalance: user.totalBalance,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Update order (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
	try {
		let order = await Order.findById(req.params.id);

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		order = await Order.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			order,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
exports.cancelOrder = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		// Make sure user is order owner
		if (
			order.user.toString() !== req.user.id &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to cancel this order",
			});
		}

		if (
			order.orderStatus === "shipped" ||
			order.orderStatus === "delivered"
		) {
			return res.status(400).json({
				success: false,
				message: "Cannot cancel shipped or delivered order",
			});
		}

		order.orderStatus = "cancelled";
		await order.save();

		// Refund user
		const user = await User.findById(req.user.id);
		user.totalBalance += order.totalPrice;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Order cancelled and refunded",
			order,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Process payment (DUMMY - not really implemented)
// @route   POST /api/orders/:id/pay
// @access  Private
exports.processPayment = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.id);

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		// This endpoint exists but is never called in the vulnerability!
		order.paymentStatus = "completed";
		await order.save();

		res.status(200).json({
			success: true,
			message: "Payment processed",
			order,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get flag
// @route   GET /api/orders/flag/check
// @access  Private
