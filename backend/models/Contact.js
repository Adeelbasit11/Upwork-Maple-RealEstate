const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: [true, "Please provide a message"],
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
