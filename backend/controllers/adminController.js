const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalSellers = await Seller.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    // Calculate total sales excluding cancelled orders
    const salesResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    // Get latest 5 orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "user totalAmount orderStatus paymentStatus createdAt"
      );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalSales,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

module.exports = {
  getAdminDashboard,
};