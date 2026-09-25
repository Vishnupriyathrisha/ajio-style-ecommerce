const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

module.exports = router;