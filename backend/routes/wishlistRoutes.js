const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");

// All wishlist routes require authentication
router.use(protect);

router.get("/", getWishlist);
router.post("/:propertyId", addToWishlist);
router.delete("/:propertyId", removeFromWishlist);

module.exports = router;
