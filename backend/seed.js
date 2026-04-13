const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Delete any existing user with this email and recreate fresh
    await User.deleteOne({ email: "admin@maple.pk" });

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@maple.pk",
      password: "admin123",
      role: "admin",
      isApproved: true,
    });

    console.log("\n✅ Admin user created successfully!\n");
    console.log("  Login Details:");
    console.log("  ─────────────────────────");
    console.log("  Email:    admin@maple.pk");
    console.log("  Password: admin123");
    console.log("  Role:     admin");
    console.log("  ID:       " + admin._id);
    console.log("");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();
