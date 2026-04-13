const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
