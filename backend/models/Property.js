const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a property title"],
    trim: true,
    maxlength: [150, "Title cannot exceed 150 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
    min: [0, "Price cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location/area"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please provide a city"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["house", "apartment", "plot", "commercial", "villa"],
    required: [true, "Please specify property type"],
  },
  purpose: {
    type: String,
    enum: ["buy", "rent"],
    required: [true, "Please specify buy or rent"],
  },
  bedrooms: {
    type: Number,
    default: 0,
    min: 0,
  },
  bathrooms: {
    type: Number,
    default: 0,
    min: 0,
  },
  area: {
    type: Number,
    default: 0,
    min: 0,
  },
  areaUnit: {
    type: String,
    enum: ["sq ft", "sq yd", "marla", "kanal"],
    default: "sq ft",
  },
  images: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search and filtering performance
propertySchema.index({ city: 1, purpose: 1, type: 1, price: 1 });
propertySchema.index({ title: "text", city: "text", location: "text" });

module.exports = mongoose.model("Property", propertySchema);
