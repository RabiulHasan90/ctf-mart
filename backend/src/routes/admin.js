const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
	getAdminStats,
	getAllUsers,
	deleteUser,
	updateUserRole,
	getAllProducts,
	deleteProduct,
	createProduct,
	getAllOrders,
	updateOrderStatus,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/stats", getAdminStats);

// Users Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// Products Management
router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProduct);
router.post("/products", createProduct);

// Orders Management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
