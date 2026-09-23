const Product = require("../models/Product");

const getProductsService = async ({
  page,
  limit,
  category,
  search,
  sort,
}) => {
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

  return {
    products,
    totalProducts,
  };
};

module.exports = {
  getProductsService,
};