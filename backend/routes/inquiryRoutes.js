const express = require("express");
const router = express.Router();
const {
  createInquiry,
  respondToInquiry,
} = require("../controllers/inquiryController");
const { protect } = require("../middleware/auth");

// User sends inquiry
router.post("/", protect, createInquiry);

// Agent responds to inquiry
router.put("/:id/respond", protect, respondToInquiry);

module.exports = router;
