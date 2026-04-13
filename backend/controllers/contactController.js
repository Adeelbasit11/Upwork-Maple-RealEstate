const asyncHandler = require("../middleware/asyncHandler");
const Contact = require("../models/Contact");

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({ name, email, subject, message });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: contact,
  });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private (admin)
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort("-createdAt");
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

module.exports = { submitContact, getContacts };
