const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  orderValidation,
  orderIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  orderValidation,
  validateRequest,
  createOrder
);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get(
  "/:id",
  protect,
  orderIdValidation,
  validateRequest,
  getOrderById
);

router.put(
  "/:id/cancel",
  protect,
  orderIdValidation,
  validateRequest,
  cancelOrder
);

module.exports = router;