const express = require("express");

const {
  register,
  login,
  createAdmin,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

// Create admin account
router.post(
  "/create-admin",
  createAdmin
);

module.exports = router;