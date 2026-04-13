const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Agent = require("../models/Agent");
const User = require("../models/User");
const Property = require("../models/Property");
const Inquiry = require("../models/Inquiry");

// @desc    Get all pending agent applications
// @route   GET /api/admin/agents/pending
// @access  Private (admin only)
const getPendingAgents = asyncHandler(async (req, res) => {
  const pendingAgents = await Agent.find({ isApproved: false }).populate(
    "userId",
    "name email avatar"
  ).lean();

  const transformed = pendingAgents.map(a => ({
    _id: a._id,
    userId: a.userId?._id || a.userId,
    name: a.userId?.name || "",
    email: a.userId?.email || "",
    avatar: a.userId?.avatar || "",
    phone: a.phone,
    agency: a.agencyName,
    location: a.location,
    experience: a.experience,
    bio: a.bio,
    verified: a.isApproved,
    isApproved: a.isApproved,
    createdAt: a.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: transformed.length,
    data: transformed,
  });
});

// @desc    Approve agent application
// @route   PUT /api/admin/agents/:id/approve
// @access  Private (admin only)
const approveAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    throw new ApiError(404, "Agent application not found");
  }

  if (agent.isApproved) {
    throw new ApiError(400, "Agent is already approved");
  }

  // Approve in Agent model
  agent.isApproved = true;
  await agent.save();

  // Approve in User model
  await User.findByIdAndUpdate(agent.userId, { isApproved: true });

  res.status(200).json({
    success: true,
    message: "Agent approved successfully",
    data: agent,
  });
});

// @desc    Reject agent application
// @route   PUT /api/admin/agents/:id/reject
// @access  Private (admin only)
const rejectAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) {
    throw new ApiError(404, "Agent application not found");
  }

  // Revert user role back to 'user'
  await User.findByIdAndUpdate(agent.userId, {
    role: "user",
    isApproved: true,
  });

  // Remove agent application
  await Agent.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Agent application rejected and removed",
  });
});

// ==================== PROPERTY MANAGEMENT ====================

// @desc    Get all pending properties
// @route   GET /api/admin/properties/pending
// @access  Private (admin only)
const getPendingProperties = asyncHandler(async (req, res) => {
  const pendingProperties = await Property.find({ isApproved: false })
    .populate("agent", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: pendingProperties.length,
    data: pendingProperties,
  });
});

// @desc    Approve property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private (admin only)
const approveProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  if (property.isApproved) {
    throw new ApiError(400, "Property is already approved");
  }

  property.isApproved = true;
  await property.save();

  res.status(200).json({
    success: true,
    message: "Property approved successfully",
    data: property,
  });
});

// @desc    Reject property
// @route   PUT /api/admin/properties/:id/reject
// @access  Private (admin only)
const rejectProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Property rejected and removed",
  });
});

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt").lean();
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "admin") throw new ApiError(400, "Cannot delete admin user");

  await User.findByIdAndDelete(req.params.id);
  await Agent.findOneAndDelete({ userId: req.params.id });

  res.status(200).json({ success: true, message: "User deleted" });
});

// ==================== ALL PROPERTIES ====================

// @desc    Get all properties (admin)
// @route   GET /api/admin/properties
// @access  Private (admin only)
const getAllProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find()
    .populate("agent", "name email")
    .sort("-createdAt")
    .lean();
  res.status(200).json({ success: true, count: properties.length, data: properties });
});

// @desc    Delete property (admin)
// @route   DELETE /api/admin/properties/:id
// @access  Private (admin only)
const deletePropertyAdmin = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, "Property not found");
  await Property.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Property deleted" });
});

// ==================== ALL AGENTS ====================

// @desc    Get all agents (admin)
// @route   GET /api/admin/agents
// @access  Private (admin only)
const getAllAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find().populate("userId", "name email avatar").lean();
  const transformed = agents.map(a => ({
    _id: a._id,
    userId: a.userId?._id || a.userId,
    name: a.userId?.name || "",
    email: a.userId?.email || "",
    avatar: a.userId?.avatar || "",
    phone: a.phone,
    agency: a.agencyName,
    location: a.location,
    experience: a.experience,
    bio: a.bio,
    verified: a.isApproved,
    isApproved: a.isApproved,
    createdAt: a.createdAt,
  }));
  res.status(200).json({ success: true, count: transformed.length, data: transformed });
});

// ==================== ALL INQUIRIES ====================

// @desc    Get all inquiries (admin)
// @route   GET /api/admin/inquiries
// @access  Private (admin only)
const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find()
    .populate("user", "name email")
    .populate("agent", "name email")
    .populate("property", "title location city")
    .sort("-createdAt")
    .lean();
  res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});

// ==================== DASHBOARD ANALYTICS ====================

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (admin only)
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalAgents,
    totalProperties,
    pendingAgents,
    pendingProperties,
    totalInquiries,
    pendingInquiries,
    recentUsers,
    recentProperties,
    recentInquiries,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Agent.countDocuments(),
    Property.countDocuments(),
    Agent.countDocuments({ isApproved: false }),
    Property.countDocuments({ isApproved: false }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "pending" }),
    User.find().sort("-createdAt").limit(5).select("name email role createdAt"),
    Property.find()
      .sort("-createdAt")
      .limit(5)
      .select("title location price isApproved createdAt")
      .populate("agent", "name"),
    Inquiry.find()
      .sort("-createdAt")
      .limit(5)
      .select("message status createdAt")
      .populate("user", "name")
      .populate("property", "title"),
  ]);

  // --- Chart data ---
  const approvedProperties = totalProperties - pendingProperties;

  // Property type breakdown
  const typeAgg = await Property.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);
  const propertyTypes = typeAgg.map((t) => ({
    name: t._id ? t._id.charAt(0).toUpperCase() + t._id.slice(1) : "Other",
    value: t.count,
  }));

  // Property purpose breakdown
  const purposeAgg = await Property.aggregate([
    { $group: { _id: "$purpose", count: { $sum: 1 } } },
  ]);
  const propertyPurpose = purposeAgg.map((p) => ({
    name: p._id === "buy" ? "For Sale" : "For Rent",
    value: p.count,
  }));

  // City distribution (top 6)
  const cityAgg = await Property.aggregate([
    { $group: { _id: "$city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);
  const cityDistribution = cityAgg.map((c) => ({
    name: c._id || "Unknown",
    properties: c.count,
  }));

  // Monthly registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        users: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const monthlyProps = await Property.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        properties: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Merge monthly data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthSet = new Set([
    ...monthlyUsers.map((m) => m._id),
    ...monthlyProps.map((m) => m._id),
  ]);
  const monthlyData = Array.from(monthSet)
    .sort()
    .map((m) => {
      const [, month] = m.split("-");
      return {
        name: monthNames[parseInt(month, 10) - 1],
        users: monthlyUsers.find((u) => u._id === m)?.users || 0,
        properties: monthlyProps.find((p) => p._id === m)?.properties || 0,
      };
    });

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalAgents,
        totalProperties,
        approvedProperties,
        pendingAgents,
        pendingProperties,
        totalInquiries,
        pendingInquiries,
      },
      charts: {
        propertyTypes,
        propertyPurpose,
        cityDistribution,
        monthlyData,
      },
      recentActivity: {
        recentUsers,
        recentProperties,
        recentInquiries,
      },
    },
  });
});

module.exports = {
  getPendingAgents,
  approveAgent,
  rejectAgent,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getDashboard,
  getAllUsers,
  deleteUser,
  getAllProperties,
  deletePropertyAdmin,
  getAllAgents,
  getAllInquiries,
};
