const { body, param, validationResult } = require("express-validator");
// Register validation
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

// Login validation
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const profileValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number."),

  body("pincode")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Please enter a valid 6-digit pincode."),

  body("password")
    .optional({ values: "falsy" })
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const productValidation = [
  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required."),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Product image is required."),

  body("stock")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Stock must be a valid non-negative number."),

  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array."),

  body("color")
    .optional({ values: "falsy" })
    .trim(),
];

const productIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID."),
];

const orderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item."),

  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required."),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required."),

  body("subtotal")
    .notEmpty()
    .withMessage("Subtotal is required.")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a valid non-negative number."),

  body("deliveryCharge")
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Delivery charge must be a valid non-negative number."),

  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required.")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a valid non-negative number."),
];

const orderIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid order ID."),
];

const paymentCreateOrderValidation = [
  body("amount")
    .notEmpty()
    .withMessage("Payment amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Payment amount must be greater than 0."),
];

const paymentVerifyValidation = [
  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required."),

  body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay payment ID is required."),

  body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage("Razorpay signature is required."),

  body("orderData")
    .notEmpty()
    .withMessage("Order data is required.")
    .isObject()
    .withMessage("Order data must be an object."),
];

const reviewValidation = [
  body("productId")
    .trim()
    .notEmpty()
    .withMessage("Product ID is required.")
    .isMongoId()
    .withMessage("Invalid product ID."),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("comment")
  .trim()
  .notEmpty()
  .withMessage("Comment is required.")
  .bail()
  .isLength({ min: 2 })
  .withMessage("Comment must be at least 2 characters."),
];

const supportTicketValidation = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Message must be at least 5 characters."),
];

const sellerRegisterValidation = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required."),

  body("sellerName")
    .trim()
    .notEmpty()
    .withMessage("Seller name is required.")
    .isLength({ min: 2 })
    .withMessage("Seller name must be at least 2 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required.")
    .matches(/^\d{6}$/)
    .withMessage("Please enter a valid 6-digit pincode."),
];

const sellerLoginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const sellerProfileValidation = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required."),

  body("sellerName")
    .trim()
    .notEmpty()
    .withMessage("Seller name is required.")
    .isLength({ min: 2 })
    .withMessage("Seller name must be at least 2 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required.")
    .matches(/^\d{6}$/)
    .withMessage("Please enter a valid 6-digit pincode."),
];

const sellerProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required."),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number."),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Product image is required."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a valid non-negative number."),

  body("sizes")
    .optional()
    .isArray()
    .withMessage("Sizes must be an array."),

  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required."),
];

const sellerProductIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID."),
];

const sellerSupportTicketValidation = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Message must be at least 5 characters."),
];

const sellerSupportTicketIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid support ticket ID."),
];

// Handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};


module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  productValidation,
  productIdValidation,
  orderValidation,
  orderIdValidation,
  paymentCreateOrderValidation,
  paymentVerifyValidation,
  reviewValidation,
  supportTicketValidation,
  sellerRegisterValidation,
  sellerLoginValidation,
  sellerProfileValidation,
  sellerProductValidation,
  sellerProductIdValidation,
  sellerSupportTicketValidation,
  sellerSupportTicketIdValidation,
  validateRequest,
};