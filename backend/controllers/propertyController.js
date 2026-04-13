const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const Property = require("../models/Property");

// @desc    Get all approved properties (filters + search + pagination)
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    type,
    purpose,
    bedrooms,
    minPrice,
    maxPrice,
    search,
    featured,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const filter = { isApproved: true };

  // --- Filters ---
  if (city) filter.city = { $regex: city, $options: "i" };
  if (type) filter.type = type;
  if (purpose) filter.purpose = purpose;
  if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
  if (featured === "true") filter.featured = true;

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // --- Search (title / city / location) ---
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // --- Pagination ---
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate("agent", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Property.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("agent", "name email")
    .lean();

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private (approved agent only)
const createProperty = asyncHandler(async (req, res) => {
  req.body.agent = req.user._id;

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    message: "Property submitted. Waiting for admin approval.",
    data: property,
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner agent only)
const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Ensure the agent owns this property
  if (property.agent.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this property");
  }

  // Don't allow changing agent or approval status
  delete req.body.agent;
  delete req.body.isApproved;

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Property updated",
    data: property,
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner agent only)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Ensure the agent owns this property
  if (property.agent.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this property");
  }

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Property deleted",
  });
});

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
