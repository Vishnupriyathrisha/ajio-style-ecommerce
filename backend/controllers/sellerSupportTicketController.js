const SellerSupportTicket = require("../models/SellerSupportTicket");

// Create seller support ticket
const createSellerTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const ticket = await SellerSupportTicket.create({
      seller: req.seller._id,
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error(
      "Create seller ticket error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket",
    });
  }
};

// Get logged-in seller's tickets
const getMySellerTickets = async (req, res) => {
  try {
    const tickets = await SellerSupportTicket.find({
      seller: req.seller._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error(
      "Get seller tickets error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets",
    });
  }
};

// Get single seller ticket
const getSellerTicketById = async (req, res) => {
  try {
    const ticket = await SellerSupportTicket.findOne({
      _id: req.params.id,
      seller: req.seller._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error(
      "Get seller ticket error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket",
    });
  }
};

module.exports = {
  createSellerTicket,
  getMySellerTickets,
  getSellerTicketById,
};