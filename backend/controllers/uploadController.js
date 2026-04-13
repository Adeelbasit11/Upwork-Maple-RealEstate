const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (approved agent)
const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an image file");
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: { imageUrl },
  });
});

// @desc    Upload multiple images (max 10)
// @route   POST /api/upload/multiple
// @access  Private (approved agent)
const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Please upload at least one image");
  }

  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  res.status(200).json({
    success: true,
    message: `${req.files.length} image(s) uploaded successfully`,
    data: { imageUrls },
  });
});

module.exports = { uploadSingle, uploadMultiple };
