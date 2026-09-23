const express = require("express");

const {
  createTicket,
  getMyTickets,
  getTicketById,
} = require("../controllers/supportTicketController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  supportTicketValidation,
  validateRequest,
} = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  supportTicketValidation,
  validateRequest,
  createTicket
);

router.get("/my-tickets", protect, getMyTickets);

router.get("/:id", protect, getTicketById);

module.exports = router;