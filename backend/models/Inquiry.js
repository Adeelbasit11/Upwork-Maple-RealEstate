const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "responded"],
    default: "pending",
  },
  response: {
    type: String,
    maxlength: [1000, "Response cannot exceed 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

inquirySchema.index({ agent: 1, status: 1 });
inquirySchema.index({ user: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
