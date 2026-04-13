const express = require("express");
const router = express.Router();
const { submitContact, getContacts } = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/auth");

// Public — anyone can submit
router.post("/", submitContact);

// Admin — view all messages
router.get("/", protect, authorize("admin"), getContacts);

module.exports = router;
