const express = require("express");

const {
  createReview,
  getProductReviews,
  checkReviewEligibility,
} = require("../controllers/reviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  reviewValidation,
  reviewProductIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get(
  "/product/:productId",
  reviewProductIdValidation,
  validateRequest,
  getProductReviews
);

router.get(
  "/eligibility/:productId",
  protect,
  reviewProductIdValidation,
  validateRequest,
  checkReviewEligibility
);

router.post(
  "/",
  protect,
  reviewValidation,
  validateRequest,
  createReview
);

module.exports = router;