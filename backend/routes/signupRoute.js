import express from "express";
import User from "../models/usermodel.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    console.log("POST /signup called");
    console.log("Request Body:", req.body);

    const { fullname, email, password, phone, role } = req.body;

    // 1. Validate required fields
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 3. Save user directly (no hashing)
    const newUser = new User({
      fullname,
      email,
      password,
      phone,
      role
    });

    await newUser.save();

    // 4. Send success response
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

export default router;
