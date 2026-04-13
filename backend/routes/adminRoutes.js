const express = require("express");
const router = express.Router();
const {
  getPendingAgents,
  approveAgent,
  rejectAgent,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getDashboard,
  getAllUsers,
  deleteUser,
  getAllProperties,
  deletePropertyAdmin,
  getAllAgents,
  getAllInquiries,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// All admin routes require: logged in + admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Agent management
router.get("/agents", getAllAgents);
router.get("/agents/pending", getPendingAgents);
router.put("/agents/:id/approve", approveAgent);
router.put("/agents/:id/reject", rejectAgent);

// Property management
router.get("/properties", getAllProperties);
router.get("/properties/pending", getPendingProperties);
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/reject", rejectProperty);
router.delete("/properties/:id", deletePropertyAdmin);

// Inquiries
router.get("/inquiries", getAllInquiries);

module.exports = router;
