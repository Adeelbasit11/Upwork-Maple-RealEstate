const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Agent = require("../models/Agent");
const User = require("../models/User");
const Property = require("../models/Property");

// @desc    Apply as agent
// @route   POST /api/agents/apply
// @access  Private (logged-in user)
const applyAsAgent = asyncHandler(async (req, res) => {
  const { agencyName, experience, location, phone, bio, avatar } = req.body;

  // Check if user already applied
  const existingApplication = await Agent.findOne({ userId: req.user._id });
  if (existingApplication) {
    throw new ApiError(400, "You have already submitted an agent application");
  }

  // Update user role to 'agent' + avatar if provided
  const userUpdate = { role: "agent", isApproved: false };
  if (avatar) userUpdate.avatar = avatar;
  await User.findByIdAndUpdate(req.user._id, userUpdate);

  const agent = await Agent.create({
    userId: req.user._id,
    agencyName,
    experience,
    location,
    phone,
    bio: bio || "",
  });

  res.status(201).json({
    success: true,
    message: "Agent application submitted. Waiting for admin approval.",
    data: agent,
  });
});

// @desc    Get all approved agents (public)
// @route   GET /api/agents
// @access  Public
const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find({ isApproved: true }).populate(
    "userId",
    "name email avatar"
  );

  // Get listing counts for each agent
  const agentData = await Promise.all(
    agents.map(async (agent) => {
      const listings = await Property.countDocuments({
        agent: agent.userId._id,
        isApproved: true,
      });
      return {
        _id: agent._id,
        userId: agent.userId._id,
        name: agent.userId.name,
        email: agent.userId.email,
        avatar: agent.userId.avatar,
        phone: agent.phone,
        agency: agent.agencyName,
        location: agent.location,
        experience: agent.experience,
        bio: agent.bio,
        verified: agent.isApproved,
        listings,
        createdAt: agent.createdAt,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: agentData.length,
    data: agentData,
  });
});

// @desc    Get single agent profile (public)
// @route   GET /api/agents/:id
// @access  Public
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id).populate(
    "userId",
    "name email avatar"
  );

  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  const listings = await Property.find({
    agent: agent.userId._id,
    isApproved: true,
  }).sort("-createdAt");

  res.status(200).json({
    success: true,
    data: {
      _id: agent._id,
      userId: agent.userId._id,
      name: agent.userId.name,
      email: agent.userId.email,
      avatar: agent.userId.avatar,
      phone: agent.phone,
      agency: agent.agencyName,
      location: agent.location,
      experience: agent.experience,
      bio: agent.bio,
      verified: agent.isApproved,
      listings,
    },
  });
});

// @desc    Update agent profile
// @route   PUT /api/agent/profile
// @access  Private (approved agent)
const updateAgentProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, agencyName, location, experience, bio, avatar } =
    req.body;

  // Update user fields
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (avatar) userFields.avatar = avatar;

  if (Object.keys(userFields).length > 0) {
    await User.findByIdAndUpdate(req.user._id, userFields, {
      runValidators: true,
    });
  }

  // Update agent fields
  const agentFields = {};
  if (phone) agentFields.phone = phone;
  if (agencyName) agentFields.agencyName = agencyName;
  if (location) agentFields.location = location;
  if (experience) agentFields.experience = experience;
  if (bio !== undefined) agentFields.bio = bio;

  if (Object.keys(agentFields).length > 0) {
    await Agent.findOneAndUpdate({ userId: req.user._id }, agentFields, {
      runValidators: true,
    });
  }

  const updatedUser = await User.findById(req.user._id);
  const updatedAgent = await Agent.findOne({ userId: req.user._id });

  res.status(200).json({
    success: true,
    message: "Profile updated",
    data: { user: updatedUser, agent: updatedAgent },
  });
});

// @desc    Get current agent's own profile
// @route   GET /api/agent/profile
// @access  Private (approved agent)
const getAgentProfile = asyncHandler(async (req, res) => {
  const agent = await Agent.findOne({ userId: req.user._id });
  if (!agent) throw new ApiError(404, "Agent profile not found");

  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json({
    success: true,
    data: {
      _id: agent._id,
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: agent.phone,
      agency: agent.agencyName,
      location: agent.location,
      experience: agent.experience,
      bio: agent.bio,
      verified: agent.isApproved,
    },
  });
});

module.exports = { applyAsAgent, getAgents, getAgentById, updateAgentProfile, getAgentProfile };
