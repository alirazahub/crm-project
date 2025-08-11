import express from "express";
import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/google-sign-in", async (req, res) => {
  try {
    const { name, email, image } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        fullname: name,
        email: email,
        role: "user", // Default role for Google users
        // No password required for Google users
      });
      await user.save();
      console.log("✅ New Google user created:", email);
    } else {
      console.log("✅ Existing Google user signed in:", email);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Send success response with token
    res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token: token,
      user: {
        id: user._id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        image: image
      }
    });

  } catch (error) {
    console.error("❌ Google sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during Google sign-in",
      error: error.message
    });
  }
});

export default router;

