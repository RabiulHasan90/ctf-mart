const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
		expiresIn: process.env.JWT_EXPIRE || "7d",
	});
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide an email and password",
			});
		}

		// Check for user
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json({ success: false, message: "Email already in use" });
		}

		// Create user with $50 signup bonus
		user = await User.create({
			name,
			email,
			password,
			signupBonus: 50,
			totalBalance: 50,
		});

		// Create token
		const token = generateToken(user._id);

		res.status(201).json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				totalBalance: user.totalBalance,
				signupBonus: user.signupBonus,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide an email and password",
			});
		}

		// Check for user
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid credentials" });
		}

		// Create token
		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				totalBalance: user.totalBalance,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				totalBalance: user.totalBalance,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
	try {
		const { name, email } = req.body;

		// Check if email already exists (if changing email)
		if (email) {
			const existingUser = await User.findOne({
				email,
				_id: { $ne: req.user.id },
			});
			if (existingUser) {
				return res.status(400).json({
					success: false,
					message: "Email already in use",
				});
			}
		}

		// Update user
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ ...(name && { name }), ...(email && { email }) },
			{ new: true, runValidators: true },
		);

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				totalBalance: user.totalBalance,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
	try {
		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Please provide old and new password",
			});
		}

		// Get user with password
		const user = await User.findById(req.user.id).select("+password");

		// Check if old password is correct
		const isMatch = await user.matchPassword(oldPassword);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Current password is incorrect",
			});
		}

		// Update password
		user.password = newPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: "Password changed successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
	try {
		const { password } = req.body;

		if (!password) {
			return res.status(400).json({
				success: false,
				message: "Please provide your password to delete account",
			});
		}

		// Get user with password
		const user = await User.findById(req.user.id).select("+password");

		// Verify password
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Password is incorrect",
			});
		}

		// Delete user and related data
		await User.findByIdAndDelete(req.user.id);

		res.status(200).json({
			success: true,
			message: "Account deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
