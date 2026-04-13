const express = require("express");
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { protect, isApprovedAgent } = require("../middleware/auth");

// Public routes
router.get("/", getProperties);
router.get("/:id", getProperty);

// Agent-only routes (must be logged in + approved agent)
router.post("/", protect, isApprovedAgent, createProperty);
router.put("/:id", protect, isApprovedAgent, updateProperty);
router.delete("/:id", protect, isApprovedAgent, deleteProperty);

module.exports = router;
