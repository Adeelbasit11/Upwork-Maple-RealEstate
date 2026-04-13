const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// @desc    Test API
// @route   GET /api/test
// @access  Public
const testAPI = asyncHandler(async (req, res) => {
  const response = new ApiResponse(200, "Maple Real Estate API is running 🏡");
  res.status(200).json(response);
});

module.exports = { testAPI };
