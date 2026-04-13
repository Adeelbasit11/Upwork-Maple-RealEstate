const express = require("express");
const router = express.Router();
const { getAgentInquiries } = require("../controllers/inquiryController");
const { updateAgentProfile, getAgentProfile } = require("../controllers/agentController");
const { protect, isApprovedAgent } = require("../middleware/auth");

// All agent dashboard routes require: logged in + approved agent
router.use(protect, isApprovedAgent);

router.get("/profile", getAgentProfile);
router.get("/inquiries", getAgentInquiries);
router.put("/profile", updateAgentProfile);

module.exports = router;
