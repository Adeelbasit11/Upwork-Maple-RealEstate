const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

// Protect routes — verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    throw new ApiError(401, "Not authorized, user not found");
  }

  next();
});

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

// Ensure agent is approved before accessing agent-only routes
const isApprovedAgent = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "agent") {
    throw new ApiError(403, "This route is for agents only");
  }

  const Agent = require("../models/Agent");
  const agent = await Agent.findOne({ userId: req.user._id });

  if (!agent || !agent.isApproved) {
    throw new ApiError(403, "Your agent account is not approved yet");
  }

  req.agent = agent;
  next();
});

module.exports = { protect, authorize, isApprovedAgent };
