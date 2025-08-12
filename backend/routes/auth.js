
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id) => {
  console.log('Generating token for user ID:', id);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
  console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
  
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  console.log('Generated token:', token);
  return token;
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ 
      success: true,
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
    
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      success: true,
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Test route to debug token generation
router.get("/test-token", async (req, res) => {
  try {
    const testUserId = "507f1f77bcf86cd799439011"; // Test MongoDB ObjectId
    const token = generateToken(testUserId);
    
    // Try to verify the token immediately
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      message: "Token test successful",
      token,
      decoded,
      jwtSecret: process.env.JWT_SECRET ? "exists" : "missing",
      jwtExpire: process.env.JWT_EXPIRE
    });
  } catch (error) {
    res.status(500).json({
      message: "Token test failed",
      error: error.message,
      jwtSecret: process.env.JWT_SECRET ? "exists" : "missing",
      jwtExpire: process.env.JWT_EXPIRE
    });
  }
});

// Get profile
router.get("/me", protect, (req, res) => {
  try {
    console.log('GET /me - User authenticated:', req.user.email);
    res.json(req.user);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout (clear cookie)
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;

