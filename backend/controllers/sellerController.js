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
const sellerId = seller._id.toString();

console.log("SELLER ID BEFORE TOKEN:", sellerId);

const token = jwt.sign(
  { id: sellerId },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

console.log("TOKEN CREATED FOR SELLER ID:", sellerId);

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

// GET SELLER PROFILE
const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).select(
      "-password"
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Get seller profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load seller profile",
    });
  }
};

// UPDATE SELLER PROFILE
const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const {
      businessName,
      sellerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !businessName ||
      !sellerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All profile fields are required",
      });
    }

    // Check whether email is already used by another seller
    const existingSeller = await Seller.findOne({
      email,
      _id: { $ne: seller._id },
    });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Email is already used by another seller",
      });
    }

    seller.businessName = businessName;
    seller.sellerName = sellerName;
    seller.email = email;
    seller.phone = phone;
    seller.address = address;
    seller.city = city;
    seller.state = state;
    seller.pincode = pincode;

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        sellerName: seller.sellerName,
        email: seller.email,
        phone: seller.phone,
        address: seller.address,
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Update seller profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update seller profile",
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

const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const products = await Product.find({
      seller: sellerId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get seller products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load seller products",
    });
  }
};

const createSellerProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      color,
    } = req.body;

    if (
      !name ||
      !brand ||
      !description ||
      price === undefined ||
      !category ||
      !image ||
      stock === undefined ||
      !color
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required product fields",
      });
    }

    const product = await Product.create({
      name,
      brand,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      color,

      // Important:
      // Product belongs to logged-in seller
      seller: req.seller._id,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Create seller product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};

const updateSellerProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const productId = req.params.id;

    const {
      name,
      brand,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      color,
    } = req.body;

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name;
    product.brand = brand;
    product.description = description;
    product.price = price;
    product.category = category;
    product.image = image;
    product.stock = stock;
    product.sizes = sizes;
    product.color = color;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update seller product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

const deleteSellerProduct = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const productId = req.params.id;

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete seller product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
   deleteSellerProduct,
};