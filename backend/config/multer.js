const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `property-${uniqueSuffix}${ext}`);
  },
});

// File filter — only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extMatch = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeMatch = allowedTypes.test(file.mimetype);

  if (extMatch && mimeMatch) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files (jpeg, jpg, png, webp) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
