const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");

const {
  productValidation,
  productIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", getProducts);

router.get(
  "/:id",
  productIdValidation,
  validateRequest,
  getProductById
);

router.post(
  "/",
  productValidation,
  validateRequest,
  createProduct
);

module.exports = router;