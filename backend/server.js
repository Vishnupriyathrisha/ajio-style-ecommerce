const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const compression = require("compression");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const profileRoutes = require("./routes/profileRoutes");
const supportTicketRoutes = require("./routes/supportTicketRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const sellerOrderRoutes = require("./routes/sellerOrderRoutes");
const sellerSupportTicketRoutes = require("./routes/sellerSupportTicketRoutes");

dotenv.config();

const app = express();

// ========================================
// ENVIRONMENT VALIDATION
// ========================================

const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

const missingEnvVariables = requiredEnvVariables.filter(
  (key) => !process.env[key]
);

if (missingEnvVariables.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVariables.join(
      ", "
    )}`
  );

  process.exit(1);
}

// ========================================
// SECURITY
// ========================================

app.use(helmet());
app.use(compression());
// ========================================
// CORS
// ========================================

const allowedOrigin =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(
  express.json({
    limit: "10kb",
  })
);

// ========================================
// RATE LIMITING
// ========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ========================================
// HEALTH CHECK
// ========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/profile", profileRoutes);

app.use(
  "/api/support-tickets",
  supportTicketRoutes
);

app.use("/api/reviews", reviewRoutes);

app.use("/api/seller", sellerRoutes);

app.use(
  "/api/seller/orders",
  sellerOrderRoutes
);

app.use(
  "/api/seller/support-tickets",
  sellerSupportTicketRoutes
);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AJIO Style E-Commerce API is running",
  });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  const statusCode =
    error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : error.message,
  });
});

// ========================================
// SERVER START
// ========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

    return server;
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

let server;

startServer().then((startedServer) => {
  server = startedServer;
});

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

const shutdownServer = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      const mongoose = require("mongoose");

      await mongoose.connection.close();

      console.log(
        "MongoDB connection closed."
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Error during shutdown:",
        error.message
      );

      process.exit(1);
    }
  });
};

process.on(
  "SIGTERM",
  () => shutdownServer("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdownServer("SIGINT")
);