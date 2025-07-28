import mongoose from "mongoose";

// Define the User Schema
const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // may be null for Google-only users
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.model("User", UserSchema);
export default User;