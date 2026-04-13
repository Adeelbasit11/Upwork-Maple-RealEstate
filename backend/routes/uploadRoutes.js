const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { uploadSingle, uploadMultiple } = require("../controllers/uploadController");
const { protect, isApprovedAgent } = require("../middleware/auth");

// Avatar upload — any logged-in user
router.post("/avatar", protect, upload.single("image"), uploadSingle);

// Property image uploads — approved agents only
router.post("/", protect, isApprovedAgent, upload.single("image"), uploadSingle);
router.post("/multiple", protect, isApprovedAgent, upload.array("images", 10), uploadMultiple);

module.exports = router;
