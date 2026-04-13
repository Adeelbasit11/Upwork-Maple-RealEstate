const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --------------- Global Middleware ---------------

// Security headers
app.use(helmet());

// CORS — whitelist origins
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (Postman, curl) or localhost in dev
      if (!origin) return cb(null, true);
      if (allowedOrigins.length && allowedOrigins.includes(origin)) return cb(null, true);
      // In development, allow all localhost ports
      if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Gzip compression
app.use(compression());

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize data — prevent NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP param pollution
app.use(hpp());

// Rate limiting — general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api", apiLimiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

// Static uploads folder — allow cross-origin so frontend can display images
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, "uploads")));

// Logging (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------- Routes ---------------

app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/agent", require("./routes/agentDashboardRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// --------------- Error Handling ---------------

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
