const express = require("express");

const {
  getAdminDashboard,
  getAdminUsers,
  getAdminSellers,
  updateAdminSellerStatus,
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

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAdminUsers
);

router.get(
  "/sellers",
  protect,
  authorizeRoles("admin"),
  getAdminSellers
);

router.patch(
  "/sellers/:id/status",
  protect,
  authorizeRoles("admin"),
  updateAdminSellerStatus
);

module.exports = router;