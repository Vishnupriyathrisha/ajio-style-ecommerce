const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  profileValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.get("/", protect, getProfile);

router.put(
  "/",
  protect,
  profileValidation,
  validateRequest,
  updateProfile
);

module.exports = router;