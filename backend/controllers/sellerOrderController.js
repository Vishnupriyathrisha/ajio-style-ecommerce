const Order = require("../models/Order");

// Get orders containing products of logged-in seller
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const orders = await Order.find({
      "items.product": { $exists: true },
    })
      .populate({
        path: "items.product",
        select: "name brand price image seller",
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.product &&
            item.product.seller &&
            item.product.seller.toString() === sellerId.toString()
        );

        if (sellerItems.length === 0) {
          return null;
        }

        return {
          ...order.toObject(),
          items: sellerItems,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      orders: sellerOrders,
    });
  } catch (error) {
    console.error("Get seller orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller orders",
    });
  }
};

// Update seller order status
const updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Placed",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.product",
      select: "seller",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const sellerOwnsProduct = order.items.some(
      (item) =>
        item.product &&
        item.product.seller &&
        item.product.seller.toString() === sellerId.toString()
    );

    if (!sellerOwnsProduct) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    order.orderStatus = orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update seller order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// Get sales summary of logged-in seller
const getSellerSalesSummary = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const orders = await Order.find({
      "items.product": { $exists: true },
    }).populate({
      path: "items.product",
      select: "seller",
    });

    let totalOrders = 0;
    let totalProductsSold = 0;
    let totalRevenue = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;
    let activeOrders = 0;

    orders.forEach((order) => {
      const sellerItems = order.items.filter(
        (item) =>
          item.product &&
          item.product.seller &&
          item.product.seller.toString() === sellerId.toString()
      );

      if (sellerItems.length === 0) {
        return;
      }

      totalOrders += 1;

      if (order.orderStatus === "Delivered") {
        deliveredOrders += 1;
      }

      if (order.orderStatus === "Cancelled") {
        cancelledOrders += 1;
      }

      if (
        order.orderStatus === "Placed" ||
        order.orderStatus === "Confirmed" ||
        order.orderStatus === "Shipped"
      ) {
        activeOrders += 1;
      }

      sellerItems.forEach((item) => {
        totalProductsSold += item.quantity;

        // Cancelled orders are not included in revenue
        if (order.orderStatus !== "Cancelled") {
          totalRevenue += item.price * item.quantity;
        }
      });
    });

    res.status(200).json({
      success: true,
      salesSummary: {
        totalOrders,
        totalProductsSold,
        totalRevenue,
        deliveredOrders,
        cancelledOrders,
        activeOrders,
      },
    });
  } catch (error) {
    console.error("Get seller sales summary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seller sales summary",
    });
  }
};

module.exports = {
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerSalesSummary,
};