const Review = require("../models/Review");

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getReviewsByProduct = async (req, res, next) => {
	try {
		const reviews = await Review.find({ product: req.params.productId })
			.populate("user", "name")
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			count: reviews.length,
			reviews,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
	try {
		const { productId, rating, comment } = req.body;

		if (!productId || !rating || !comment) {
			return res.status(400).json({
				success: false,
				message: "Please provide all required fields",
			});
		}

		// Check if user has already reviewed this product
		const existingReview = await Review.findOne({
			user: req.user.id,
			product: productId,
		});

		if (existingReview) {
			return res.status(400).json({
				success: false,
				message:
					"You have already reviewed this product. You can only leave one review per product.",
			});
		}

		const review = await Review.create({
			user: req.user.id,
			product: productId,
			rating,
			comment,
		});

		const populatedReview = await Review.findById(review._id).populate(
			"user",
			"name",
		);

		res.status(201).json({
			success: true,
			review: populatedReview,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
	try {
		let review = await Review.findById(req.params.id);

		if (!review) {
			return res
				.status(404)
				.json({ success: false, message: "Review not found" });
		}

		// Make sure user is review owner
		if (review.user.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update this review",
			});
		}

		review = await Review.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			review,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
	try {
		const review = await Review.findById(req.params.id);

		if (!review) {
			return res
				.status(404)
				.json({ success: false, message: "Review not found" });
		}

		// Make sure user is review owner
		if (review.user.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to delete this review",
			});
		}

		await Review.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			message: "Review deleted",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
