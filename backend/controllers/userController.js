const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.body.avatar,
  };

  // Remove undefined fields
  Object.keys(allowedFields).forEach(
    (key) => allowedFields[key] === undefined && delete allowedFields[key]
  );

  if (Object.keys(allowedFields).length === 0) {
    throw new ApiError(400, "Please provide fields to update");
  }

  const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated",
    data: user,
  });
});

// @desc    Get user's favorite properties (wishlist)
// @route   GET /api/user/favorites
// @access  Private
const getFavorites = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: "properties",
    select: "title price location type category bedrooms bathrooms images isApproved",
    populate: { path: "agent", select: "name" },
  });

  res.status(200).json({
    success: true,
    count: wishlist ? wishlist.properties.length : 0,
    data: wishlist ? wishlist.properties : [],
  });
});

// @desc    Get user's sent inquiries
// @route   GET /api/user/inquiries
// @access  Private
const getUserInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({ user: req.user._id })
    .populate("property", "title location price images")
    .populate("agent", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

// @desc    Get agent's own listed properties
// @route   GET /api/user/properties
// @access  Private (agent)
const getMyProperties = asyncHandler(async (req, res) => {
  if (req.user.role !== "agent") {
    throw new ApiError(403, "This route is for agents only");
  }

  const properties = await Property.find({ agent: req.user._id }).sort(
    "-createdAt"
  );

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getFavorites,
  getUserInquiries,
  getMyProperties,
};
