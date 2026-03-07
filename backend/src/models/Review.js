const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			required: true,
		},
		rating: {
			type: Number,
			required: [true, "Please provide a rating"],
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: [true, "Please add a comment"],
			maxlength: [500, "Comment cannot exceed 500 characters"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
