const Product = require("../models/Product");
const { cache } = require("../utils/cache");

const getProductsService = async ({
  page,
  limit,
  category,
  search,
  sort,
}) => {
  const cacheKey = `products:${page}:${limit}:${category || ""}:${search || ""}:${sort || ""}`;

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("✅ Products fetched from cache");
    return cachedData;
  }

  console.log("🗄️ Products fetched from database");

  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
  };

  if (category) {
    filter.category = category;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    filter.$or = [
      { name: searchRegex },
      { brand: searchRegex },
      { category: searchRegex },
    ];
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "low") {
    sortOption = { price: 1 };
  }

  if (sort === "high") {
    sortOption = { price: -1 };
  }

  if (sort === "name") {
    sortOption = { name: 1 };
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .select("_id brand name price image")
      .sort(sortOption)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  const result = {
    products,
    totalProducts,
  };

  cache.set(cacheKey, result);

  return result;
};

// Get single active product
const getProductByIdService = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  return product;
};

// Create product
const createProductService = async (productData) => {
  const product = await Product.create(productData);

  return product;
};

module.exports = {
  getProductsService,
  getProductByIdService,
  createProductService,
};