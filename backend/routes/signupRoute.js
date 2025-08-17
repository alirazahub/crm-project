import express from "express";
import bcrypt from "bcrypt";
import User from "../models/usermodel.js"; // Adjust the path as necessary

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    console.log("POST /register/users called");
    console.log("Request Body:", req.body);
    const { fullname, email, password, phone, role } = req.body;

    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullname,
      email,
      password, // Assuming password is already hashed before this step
      phone,
      role,
    });

    await newUser.save();

    res.status(201).json({
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role, // <-- make sure this is returned
      },
    });
    alert("Registration successful. You can now log in.");
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
