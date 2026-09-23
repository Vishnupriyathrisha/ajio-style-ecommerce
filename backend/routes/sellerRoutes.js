const express = require("express");

const { registerSeller,
        loginSeller,
        getSellerProfile,
        updateSellerProfile,
        getSellerDashboard,
        getSellerProducts,
        createSellerProduct,
        updateSellerProduct,
         deleteSellerProduct,
 } = require("../controllers/sellerController");

 const sellerProtect = require("../middleware/sellerAuthMiddleware");

 const {
  sellerRegisterValidation,
  sellerLoginValidation,
  sellerProfileValidation,
  sellerProductValidation,
  sellerProductIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  sellerRegisterValidation,
  validateRequest,
  registerSeller
);

router.post(
  "/login",
  sellerLoginValidation,
  validateRequest,
  loginSeller
);

router.get(
  "/profile",
  sellerProtect,
  getSellerProfile
);

router.put(
  "/profile",
  sellerProtect,
  sellerProfileValidation,
  validateRequest,
  updateSellerProfile
);

router.get(
  "/dashboard",
  sellerProtect,
  getSellerDashboard
);

router.get(
  "/products",
  sellerProtect,
  getSellerProducts
);

router.post(
  "/products",
  sellerProtect,
  sellerProductValidation,
  validateRequest,
  createSellerProduct
);

router.put(
  "/products/:id",
  sellerProtect,
  sellerProductIdValidation,
  sellerProductValidation,
  validateRequest,
  updateSellerProduct
);

router.delete(
  "/products/:id",
  sellerProtect,
  sellerProductIdValidation,
  validateRequest,
  deleteSellerProduct
);
module.exports = router;