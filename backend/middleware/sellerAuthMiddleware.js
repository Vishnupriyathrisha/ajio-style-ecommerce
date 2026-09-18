const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const sellerProtect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Seller token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (seller.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Seller account is blocked",
      });
    }

    req.seller = seller;

    next();
  } catch (error) {
    console.error("Seller auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired seller token",
    });
  }
};

module.exports = sellerProtect;