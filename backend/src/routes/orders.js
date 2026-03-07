const express = require("express");
const {
	getOrders,
	getMyOrders,
	getOrder,
	createOrder,
	updateOrder,
	cancelOrder,
	processPayment,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Specific routes first (before :id routes)
router.get("/my-orders", protect, getMyOrders);

// Generic routes after specific ones
router.get("/", protect, authorize("admin"), getOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, authorize("admin"), updateOrder);
router.delete("/:id", protect, cancelOrder);
router.post("/:id/pay", protect, processPayment);

module.exports = router;
