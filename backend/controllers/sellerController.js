const Seller = require("../models/Seller");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SELLER REGISTER
const registerSeller = async (req, res) => {
  try {
    const {
      businessName,
      sellerName,
      email,
      phone,
      password,
      address,
      city,
      state,
      pincode,
    } = req.body;

    // Required fields
    if (
      !businessName ||
      !sellerName ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing seller
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create seller
    const seller = await Seller.create({
      businessName,
      sellerName,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      pincode,
    });

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        sellerName: seller.sellerName,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Seller registration error:", error);

    res.status(500).json({
      success: false,
      message: "Seller registration failed",
    });
  }
};


// SELLER LOGIN
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find seller
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      seller.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check seller status
    if (seller.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Seller account is blocked",
      });
    }

    const token = jwt.sign(
  { id: seller._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.status(200).json({
  success: true,
  message: "Seller login successful",
  token,
  seller: {
    id: seller._id,
    businessName: seller.businessName,
    sellerName: seller.sellerName,
    email: seller.email,
    status: seller.status,
  },
});
  } catch (error) {
    console.error("Seller login error:", error);

    res.status(500).json({
      success: false,
      message: "Seller login failed",
    });
  }
};

// SELLER DASHBOARD
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Seller products
    const products = await Product.find({
      seller: sellerId,
    });

    // Total products
    const totalProducts = products.length;

    // Low stock products
    const lowStockProducts = products.filter(
      (product) => product.stock > 0 && product.stock <= 5
    ).length;

    // Out of stock products
    const outOfStockProducts = products.filter(
      (product) => product.stock === 0
    ).length;

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
      },
    });
  } catch (error) {
    console.error("Seller dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load seller dashboard",
    });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
   getSellerDashboard,
};