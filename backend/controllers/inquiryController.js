const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc    Send inquiry to agent about a property
// @route   POST /api/inquiries
// @access  Private (logged-in user)
const createInquiry = asyncHandler(async (req, res) => {
  const { propertyId, message } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Prevent agent from inquiring on own property
  if (property.agent.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot send an inquiry on your own property");
  }

  const inquiry = await Inquiry.create({
    user: req.user._id,
    property: propertyId,
    agent: property.agent,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Inquiry sent to agent",
    data: inquiry,
  });
});

// @desc    Get all inquiries for logged-in agent
// @route   GET /api/agent/inquiries
// @access  Private (approved agent)
const getAgentInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ agent: req.user._id })
    .populate("user", "name email")
    .populate("property", "title location price")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

// @desc    Respond to an inquiry
// @route   PUT /api/inquiries/:id/respond
// @access  Private (owner agent)
const respondToInquiry = asyncHandler(async (req, res) => {
  const { response } = req.body;

  if (!response) {
    throw new ApiError(400, "Please provide a response message");
  }

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  // Only the assigned agent can respond
  if (inquiry.agent.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to respond to this inquiry");
  }

  if (inquiry.status === "responded") {
    throw new ApiError(400, "Inquiry already responded");
  }

  inquiry.response = response;
  inquiry.status = "responded";
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: "Inquiry responded",
    data: inquiry,
  });
});

module.exports = { createInquiry, getAgentInquiries, respondToInquiry };
