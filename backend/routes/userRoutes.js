const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getFavorites,
  getUserInquiries,
  getMyProperties,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// All user dashboard routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/favorites", getFavorites);
router.get("/inquiries", getUserInquiries);
router.get("/properties", getMyProperties);

module.exports = router;
