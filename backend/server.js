const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

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
// SERVER START
// ========================================

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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

startServer();

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

const shutdownServer = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  if (!server) {
    process.exit(0);
  }

  server.close(async () => {
    try {
      const mongoose = require("mongoose");

      await mongoose.connection.close();

      console.log("MongoDB connection closed.");

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

process.on("SIGTERM", () => shutdownServer("SIGTERM"));

process.on("SIGINT", () => shutdownServer("SIGINT"));