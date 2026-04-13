const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Wishlist = require("../models/Wishlist");
const Property = require("../models/Property");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: "properties",
    select: "title price location type category bedrooms bathrooms images isApproved",
    populate: { path: "agent", select: "name" },
  });

  if (!wishlist) {
    wishlist = { user: req.user._id, properties: [] };
  }

  res.status(200).json({
    success: true,
    count: wishlist.properties.length,
    data: wishlist,
  });
});

// @desc    Add property to wishlist
// @route   POST /api/wishlist/:propertyId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      properties: [req.params.propertyId],
    });
  } else {
    if (wishlist.properties.includes(req.params.propertyId)) {
      throw new ApiError(400, "Property already in wishlist");
    }
    wishlist.properties.push(req.params.propertyId);
    await wishlist.save();
  }

  res.status(200).json({
    success: true,
    message: "Property added to wishlist",
    data: wishlist,
  });
});

// @desc    Remove property from wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  const index = wishlist.properties.indexOf(req.params.propertyId);
  if (index === -1) {
    throw new ApiError(404, "Property not in wishlist");
  }

  wishlist.properties.splice(index, 1);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Property removed from wishlist",
    data: wishlist,
  });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
