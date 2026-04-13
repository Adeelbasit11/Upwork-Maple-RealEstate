const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  agencyName: {
    type: String,
    required: [true, "Please provide agency name"],
    trim: true,
    maxlength: [100, "Agency name cannot exceed 100 characters"],
  },
  experience: {
    type: Number,
    required: [true, "Please provide years of experience"],
    min: [0, "Experience cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Please provide location"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide phone number"],
    trim: true,
  },
  bio: {
    type: String,
    default: "",
    maxlength: [500, "Bio cannot exceed 500 characters"],
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

agentSchema.index({ isApproved: 1 });
agentSchema.index({ location: 1 });

module.exports = mongoose.model("Agent", agentSchema);
