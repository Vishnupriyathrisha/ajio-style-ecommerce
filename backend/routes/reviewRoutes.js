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
  productIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get(
  "/product/:productId",
  productIdValidation,
  validateRequest,
  getProductReviews
);

router.get(
  "/eligibility/:productId",
  protect,
  productIdValidation,
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