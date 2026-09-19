const express = require("express");

const { registerSeller,
        loginSeller,
        getSellerDashboard,
        getSellerProducts,
        createSellerProduct,
        updateSellerProduct,
         deleteSellerProduct,
 } = require("../controllers/sellerController");

 const sellerProtect = require("../middleware/sellerAuthMiddleware");

const router = express.Router();

// Seller Register
router.post("/register", registerSeller);
// Seller Login
router.post("/login", loginSeller);
// Seller Dashboard
router.get("/dashboard", sellerProtect, getSellerDashboard);
// Seller Products
router.get("/products", sellerProtect, getSellerProducts);
//create SellerProduct
router.post( "/products", sellerProtect, createSellerProduct);
router.put("/products/:id",sellerProtect,updateSellerProduct);
router.delete( "/products/:id", sellerProtect, deleteSellerProduct);
module.exports = router;