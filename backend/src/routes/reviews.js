const express = require("express");
const {
	getReviewsByProduct,
	createReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
