const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Please provide a comment"],
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.index({ agent: 1, createdAt: -1 });
reviewSchema.index({ user: 1, agent: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
