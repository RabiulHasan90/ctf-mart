const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please add a product name"],
			trim: true,
			maxlength: [100, "Product name cannot be more than 100 characters"],
		},
		description: {
			type: String,
			required: [true, "Please add a description"],
			maxlength: [500, "Description cannot exceed 500 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please add a price"],
			min: [0, "Price cannot be negative"],
		},
		category: {
			type: String,
			required: [true, "Please add a category"],
			enum: [
				"Electronics",
				"Clothing",
				"Books",
				"Home",
				"Sports",
				"Other",
			],
		},
		stock: {
			type: Number,
			required: [true, "Please add stock quantity"],
			default: 10,
			min: [0, "Stock cannot be negative"],
		},
		imageUrl: {
			type: String,
			default:
				"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
		},
		rating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		reviews: {
			type: mongoose.Schema.ObjectId,
			ref: "Review",
		},
		privateData: {
			type: String,
			default: "",
			maxlength: [1000, "Private data cannot exceed 1000 characters"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
