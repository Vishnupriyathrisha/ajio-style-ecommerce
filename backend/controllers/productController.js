const Product = require("../models/Product");
const {
  getProductsService,
} = require("../services/productService");

// Get active products with pagination, search, filter and sort
const getProducts = async (req, res) => {
  try {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 12, 1),
      50
    );

    const { category, search, sort } = req.query;

    const { products, totalProducts } =
      await getProductsService({
        page,
        limit,
        category,
        search,
        sort,
      });

    const totalPages = Math.ceil(
      totalProducts / limit
    );

    res.status(200).json({
      success: true,
      count: products.length,

      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      brand,
      name,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      color,
    } = req.body;

    if (
      !brand ||
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product details",
      });
    }

    const product = await Product.create({
      brand,
      name,
      description,
      price,
      category,
      image,
      stock,
      sizes,
      color,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};