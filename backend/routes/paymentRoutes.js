const express = require("express");

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  paymentCreateOrderValidation,
  paymentVerifyValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/create-order",
  protect,
  paymentCreateOrderValidation,
  validateRequest,
  createRazorpayOrder
);

router.post(
  "/verify-payment",
  protect,
  paymentVerifyValidation,
  validateRequest,
  verifyRazorpayPayment
);

module.exports = router;