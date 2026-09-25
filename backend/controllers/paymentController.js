require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { retryAsync } = require("../utils/retry");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

   const order = await retryAsync(
  () => razorpay.orders.create(options),
  3,
  500,
  10000
);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);

    res.status(500).json({
    success: false,
    message: "Failed to create Razorpay order",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderData
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: "ONLINE",
      paymentStatus: "Paid",
      orderStatus: "Placed",
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      totalAmount: orderData.totalAmount,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Payment verification failed:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};