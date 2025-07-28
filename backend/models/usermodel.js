const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = UserSchema;