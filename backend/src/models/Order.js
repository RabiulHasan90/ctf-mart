const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		items: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
			min: 0,
		},
		// VULNERABILITY: Payment status is NOT checked before completing the order
		// This allows users to skip payment and still get the order completed
		paymentStatus: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		orderStatus: {
			type: String,
			enum: [
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled",
			],
			default: "pending",
		},
		shippingAddress: {
			street: String,
			city: String,
			state: String,
			zipCode: String,
			country: String,
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

module.exports = mongoose.model("Order", orderSchema);
