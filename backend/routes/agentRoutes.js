const express = require("express");
const router = express.Router();
const {
  applyAsAgent,
  getAgents,
  getAgentById,
} = require("../controllers/agentController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/", getAgents);
router.get("/:id", getAgentById);

// Protected
router.post("/apply", protect, applyAsAgent);

module.exports = router;
