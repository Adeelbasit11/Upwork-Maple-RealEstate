const express = require("express");
const router = express.Router();
const { getAgentReviews, getMyReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// Public — get reviews for a specific agent
router.get("/agent/:agentId", getAgentReviews);

// Private — get reviews for logged-in agent's dashboard
router.get("/my", protect, getMyReviews);

// Private — create a review
router.post("/", protect, createReview);

module.exports = router;
