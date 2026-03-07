const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalProducts = await Product.countDocuments();
		const totalOrders = await Order.countDocuments();

		const orders = await Order.find();
		const totalRevenue = orders.reduce(
			(sum, order) => sum + order.totalPrice,
			0,
		);

		res.status(200).json({
			success: true,
			stats: {
				totalUsers,
				totalProducts,
				totalOrders,
				totalRevenue,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find().select("-password");

		res.status(200).json({
			success: true,
			count: users.length,
			users,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
	try {
		const { role } = req.body;

		if (!["user", "admin"].includes(role)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid role" });
		}

		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ role },
			{ new: true },
		);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "Role updated successfully",
			user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res, next) => {
	try {
		const products = await Product.find();

		res.status(200).json({
			success: true,
			count: products.length,
			products,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
	try {
		const {
			name,
			description,
			price,
			category,
			stock,
			imageUrl,
			privateData,
		} = req.body;

		if (
			!name ||
			!description ||
			!price ||
			!category ||
			stock === undefined
		) {
			return res.status(400).json({
				success: false,
				message: "Please provide all required fields",
			});
		}

		const product = await Product.create({
			name,
			description,
			price,
			category,
			stock,
			imageUrl: imageUrl || undefined,
			privateData: privateData || "",
		});

		res.status(201).json({
			success: true,
			message: "Product created successfully",
			product,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
	try {
		const orders = await Order.find()
			.populate("user", "name email")
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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
	try {
		const { orderStatus } = req.body;

		if (
			![
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			].includes(orderStatus)
		) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid order status" });
		}

		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ orderStatus },
			{ new: true },
		);

		if (!order) {
			return res
				.status(404)
				.json({ success: false, message: "Order not found" });
		}

		res.status(200).json({
			success: true,
			message: "Order status updated successfully",
			order,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
