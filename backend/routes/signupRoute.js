import express from "express";
import User from "../models/usermodel.js";

const router = express.Router();
// Fixed backend signup route
router.post("/signup", async (req, res) => {
  try {
    console.log("POST /signup called");
    console.log("Request Body:", req.body);

    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email, and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email" 
      });
    }

    // Create new user with correct field mapping
    const newUser = new User({
      fullname: name, // Map 'name' from frontend to 'fullname' in schema
      email,
      password,
      role: role || "user"
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const userResponse = {
      id: savedUser._id,
      fullname: savedUser.fullname,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt
    };

    // Send success response (only once!)
    res.status(201).json({ 
      message: "Registration successful", 
      user: userResponse 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: error.message || "Something went wrong" 
    });
  }
});
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
export default router;
