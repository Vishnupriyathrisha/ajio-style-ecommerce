const Review = require("../models/Review");
const Order = require("../models/Order");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, rating and comment are required",
      });
    }

    // Check whether user has a delivered order containing this product
    const deliveredOrder = await Order.findOne({
      user: req.user.id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: "You can review a product only after it is delivered",
      });
    }

    // Check whether user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("product", "name");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// GET PRODUCT REVIEWS
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

// CHECK WHETHER USER CAN REVIEW
const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    const deliveredOrder = await Order.findOne({
      user: req.user.id,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!deliveredOrder) {
      return res.status(200).json({
        success: true,
        canReview: false,
        alreadyReviewed: false,
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    res.status(200).json({
      success: true,
      canReview: !existingReview,
      alreadyReviewed: !!existingReview,
    });
  } catch (error) {
    console.error("Check review eligibility error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check review eligibility",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  checkReviewEligibility,
};