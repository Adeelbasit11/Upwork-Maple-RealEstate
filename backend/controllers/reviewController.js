const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Review = require("../models/Review");

// @desc    Get reviews for an agent
// @route   GET /api/reviews/agent/:agentId
// @access  Public
const getAgentReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ agent: req.params.agentId })
    .populate("user", "name")
    .populate("property", "title")
    .sort("-createdAt")
    .lean();

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Get reviews for the logged-in agent (dashboard)
// @route   GET /api/reviews/my
// @access  Private (agent)
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ agent: req.user._id })
    .populate("user", "name")
    .populate("property", "title")
    .sort("-createdAt")
    .lean();

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Create a review for an agent
// @route   POST /api/reviews
// @access  Private (user)
const createReview = asyncHandler(async (req, res) => {
  const { agent, property, rating, comment } = req.body;

  const existing = await Review.findOne({ user: req.user._id, agent });
  if (existing) throw new ApiError(400, "You have already reviewed this agent");

  const review = await Review.create({
    agent,
    user: req.user._id,
    property,
    rating,
    comment,
  });

  res.status(201).json({ success: true, data: review });
});

module.exports = { getAgentReviews, getMyReviews, createReview };
