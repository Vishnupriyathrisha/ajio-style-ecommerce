const User = require("../models/User");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

const getAdminSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error("Admin sellers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load sellers",
    });
  }
};

const updateAdminSellerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Blocked",
    ];

    // Validate status
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller status",
      });
    }

    // Find seller
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    // Update status
    seller.status = status;

    await seller.save();

    // Send email when seller is approved
   if (status === "Approved") {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: seller.email,
    subject: "AJIO Seller Account Approved",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Congratulations ${seller.sellerName}!</h2>

        <p>
          Your seller account for
          <strong>${seller.businessName}</strong>
          has been approved.
        </p>

        <p>
          You can now login to your seller account and
          start managing your products and orders.
        </p>

        <p>
          Thank you for joining AJIO.
        </p>

        <br />

        <p>
          Regards,<br />
          <strong>AJIO Admin Team</strong>
        </p>
      </div>
    `,
  });
}

if (status === "Rejected") {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: seller.email,
    subject: "AJIO Seller Application Update",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${seller.sellerName},</h2>

        <p>
          We regret to inform you that your seller application for
          <strong>${seller.businessName}</strong>
          has been rejected.
        </p>

        <p>
          Please contact the AJIO Admin Team if you need
          more information regarding this decision.
        </p>

        <br />

        <p>
          Regards,<br />
          <strong>AJIO Admin Team</strong>
        </p>
      </div>
    `,
  });
}

if (status === "Blocked") {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: seller.email,
    subject: "AJIO Seller Account Blocked",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${seller.sellerName},</h2>

        <p>
          Your seller account for
          <strong>${seller.businessName}</strong>
          has been blocked by the AJIO Admin Team.
        </p>

        <p>
          You will not be able to access your seller account
          while the account is blocked.
        </p>

        <p>
          Please contact the AJIO Admin Team for further information.
        </p>

        <br />

        <p>
          Regards,<br />
          <strong>AJIO Admin Team</strong>
        </p>
      </div>
    `,
  });
}

    return res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
      seller: {
        id: seller._id,
        businessName: seller.businessName,
        sellerName: seller.sellerName,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    console.error("Admin seller status update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update seller status",
    });
  }
};
module.exports = {
  getAdminDashboard,
  getAdminUsers,
  getAdminSellers,
  updateAdminSellerStatus,
};