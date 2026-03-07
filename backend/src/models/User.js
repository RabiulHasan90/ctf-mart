const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
			maxlength: [50, "Name cannot be more than 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please add a valid email",
			],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 6,
			select: false,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		signupBonus: {
			type: Number,
			default: 50, // $50 signup bonus
		},
		totalBalance: {
			type: Number,
			default: 50, // Initial balance = signup bonus
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
