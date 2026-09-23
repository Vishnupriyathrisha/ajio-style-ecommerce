const express = require("express");

const {
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerSalesSummary,
} = require("../controllers/sellerOrderController");

const sellerProtect = require("../middleware/sellerAuthMiddleware");

const {
  orderIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Seller Orders
router.get("/", sellerProtect, getSellerOrders);

// Seller Sales Summary
router.get("/sales-summary", sellerProtect, getSellerSalesSummary);

// Update Order Status
router.put(
  "/:id/status",
  sellerProtect,
  orderIdValidation,
  validateRequest,
  updateSellerOrderStatus
);

module.exports = router;