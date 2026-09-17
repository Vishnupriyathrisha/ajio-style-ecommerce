const express = require("express");

const {
  createReview,
  getProductReviews,
  checkReviewEligibility,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews for a product
router.get("/product/:productId", getProductReviews);

// Check whether logged-in user can review
router.get(
  "/eligibility/:productId",
  protect,
  checkReviewEligibility
);

// Add review
router.post("/", protect, createReview);

module.exports = router;