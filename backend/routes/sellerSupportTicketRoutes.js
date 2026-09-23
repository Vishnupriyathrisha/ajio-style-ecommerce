const express = require("express");

const {
  createSellerTicket,
  getMySellerTickets,
  getSellerTicketById,
} = require("../controllers/sellerSupportTicketController");

const sellerProtect = require("../middleware/sellerAuthMiddleware");

const {
  sellerSupportTicketValidation,
  sellerSupportTicketIdValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create seller support ticket
router.post(
  "/",
  sellerProtect,
  sellerSupportTicketValidation,
  validateRequest,
  createSellerTicket
);

// Get logged-in seller's tickets
router.get(
  "/my-tickets",
  sellerProtect,
  getMySellerTickets
);

// Get single seller ticket
router.get(
  "/:id",
  sellerProtect,
  sellerSupportTicketIdValidation,
  validateRequest,
  getSellerTicketById
);

module.exports = router;