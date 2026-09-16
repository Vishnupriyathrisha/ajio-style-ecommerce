const express = require("express");

const {
  createTicket,
  getMyTickets,
  getTicketById,
} = require("../controllers/supportTicketController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTicket);

router.get("/my-tickets", protect, getMyTickets);

router.get("/:id", protect, getTicketById);

module.exports = router;