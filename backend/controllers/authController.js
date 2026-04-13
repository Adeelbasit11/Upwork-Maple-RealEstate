const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

// Helper — send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
  };

  res.status(statusCode).json({
    success: true,
    token,
    data: userData,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Only allow 'user' and 'agent' roles during registration
  const allowedRoles = ["user", "agent"];
  const userRole = allowedRoles.includes(role) ? role : "user";

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    isApproved: userRole === "user", // users auto-approved, agents need approval
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if agent is approved
  if (user.role === "agent" && !user.isApproved) {
    throw new ApiError(403, "Your agent account is pending approval");
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide current and new password");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});

module.exports = { register, login, getMe, changePassword };
