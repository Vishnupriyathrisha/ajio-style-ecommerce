const express = require("express");

const { registerSeller,
         loginSeller,
         getSellerDashboard,
 } = require("../controllers/sellerController");

 const sellerProtect = require("../middleware/sellerAuthMiddleware");

const router = express.Router();

// Seller Register
router.post("/register", registerSeller);
// Seller Login
router.post("/login", loginSeller);
// Seller Dashboard
router.get("/dashboard", sellerProtect, getSellerDashboard);
module.exports = router;