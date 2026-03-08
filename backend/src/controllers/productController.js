const Product = require("../models/Product");
const Review = require("../models/Review");

// @desc    Get all products with filtering and search
// @route   GET /api/products
// @access  Public
// @query   search - Search by product name
// @query   category - Filter by category
// @query   minPrice - Minimum price filter
// @query   maxPrice - Maximum price filter
exports.getProducts = async (req, res, next) => {
	try {
		const { search, category, minPrice, maxPrice } = req.query;

		// Build filter object
		const filter = {};

		// Search filter - case-insensitive search on name and description
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Category filter
		if (category && category !== "All") {
			filter.category = category;
		}

		// Price range filter
		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) {
				filter.price.$gte = parseFloat(minPrice);
			}
			if (maxPrice) {
				filter.price.$lte = parseFloat(maxPrice);
			}
		}

		// Execute query with filters - exclude privateData field
		let products = await Product.find(filter)
			.select("-privateData")
			.sort({ createdAt: -1 });

		// Enrich products with average rating
		products = await Promise.all(
			products.map(async (product) => {
				const reviews = await Review.find({ product: product._id });
				if (reviews.length > 0) {
					const avgRating =
						reviews.reduce(
							(sum, review) => sum + review.rating,
							0,
						) / reviews.length;
					product.rating = parseFloat(avgRating.toFixed(1));
				} else {
					product.rating = 0;
				}
				return product;
			}),
		);

		res.status(200).json({
			success: true,
			count: products.length,
			products,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
	try {
		const Order = require("../models/Order");
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		// Get average rating from reviews
		const reviews = await Review.find({ product: req.params.id });
		if (reviews.length > 0) {
			const avgRating =
				reviews.reduce((sum, review) => sum + review.rating, 0) /
				reviews.length;
			product.rating = parseFloat(avgRating.toFixed(1));
		} else {
			product.rating = 0;
		}

		// Check if user has purchased this product
		let hasPurchased = false;
		if (req.user && req.user.id) {
			const order = await Order.findOne({
				user: req.user.id,
				"items.product": req.params.id,
			});
			hasPurchased = !!order;
		}

		// Always exclude privateData from response - frontend handles display based on hasPurchased flag
		const productObj = product.toObject();
		delete productObj.privateData;

		res.status(200).json({
			success: true,
			product: productObj,
			hasPurchased,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
	try {
		const product = await Product.create(req.body);

		res.status(201).json({
			success: true,
			product,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
	try {
		let product = await Product.findById(req.params.id);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			product,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
// @desc Add product to cart and reduce stock

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });
		}

		await Product.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			message: "Product deleted",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
