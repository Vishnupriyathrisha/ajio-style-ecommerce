const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = require("../app");
const Product = require("../models/Product");
const { cache } = require("../utils/cache");

describe("Products API", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ========================================
  // GET ALL PRODUCTS
  // ========================================

  test("GET /api/products should return products successfully", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Products fetched successfully"
    );

    expect(response.body.pagination).toBeDefined();
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  // ========================================
  // GET PRODUCT BY ID
  // ========================================

  test("GET /api/products/:id should return a single product", async () => {
    const product = await Product.findOne({
      isActive: true,
    });

    expect(product).not.toBeNull();

    const response = await request(app).get(
      `/api/products/${product._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product fetched successfully"
    );

    expect(response.body.product).toBeDefined();

    expect(response.body.product._id).toBe(
      product._id.toString()
    );
  });

  // ========================================
  // CREATE PRODUCT
  // ========================================

  test("POST /api/products should create a new product", async () => {
    const productData = {
      brand: "Test Brand",
      name: "Automated Test Product",
      description: "Product created by automated test",
      price: 999,
      category: "Men",
      image: "https://example.com/test-product.jpg",
      stock: 10,
      sizes: ["M", "L"],
      color: "Black",
    };

    const response = await request(app)
      .post("/api/products")
      .send(productData);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product created successfully"
    );

    expect(response.body.product).toBeDefined();

    expect(response.body.product.name).toBe(
      productData.name
    );

    expect(response.body.product.brand).toBe(
      productData.brand
    );

    // Cleanup test product
    await Product.findByIdAndDelete(
      response.body.product._id
    );
  });

  // ========================================
  // CREATE PRODUCT - VALIDATION
  // ========================================

  test("POST /api/products should return 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        brand: "Test Brand",
        name: "Invalid Product",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
  "Validation failed."
);
  });

  // INVALID PRODUCT ID
test("GET /api/products/:id should return 400 for invalid product ID", async () => {
  const response = await request(app).get(
    "/api/products/invalid-product-id"
  );

  expect(response.statusCode).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    "Validation failed."
  );

  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toBe(
    "Invalid product ID."
  );
});

// PRODUCT NOT FOUND
test("GET /api/products/:id should return 404 when product does not exist", async () => {
  const nonExistingId = new mongoose.Types.ObjectId();

  const response = await request(app).get(
    `/api/products/${nonExistingId}`
  );

  expect(response.statusCode).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    "Product not found"
  );
});

// UNKNOWN ROUTE
test("GET unknown route should return 404", async () => {
  const response = await request(app).get(
    "/api/this-route-does-not-exist"
  );

  expect(response.statusCode).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe(
    "Route not found"
  );
});

// CACHE BEHAVIOR
test("GET /api/products should use cache for repeated requests", async () => {
  cache.flushAll();

  const firstResponse = await request(app).get(
    "/api/products?page=1&limit=12"
  );

  expect(firstResponse.statusCode).toBe(200);

  const secondResponse = await request(app).get(
    "/api/products?page=1&limit=12"
  );

  expect(secondResponse.statusCode).toBe(200);

  expect(secondResponse.body).toEqual(
    firstResponse.body
  );
});
});