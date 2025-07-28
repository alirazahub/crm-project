import express from "express";
import bcrypt from "bcrypt";
import User from "../models/usermodel.js"; // Adjust the path as necessary

const router = express.Router();

router.post("/users", async (req, res) => {
    try {
        console.log("POST /register/users called");
        console.log("Request Body:", req.body);
        const { fullname, email, password, phone, role } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
