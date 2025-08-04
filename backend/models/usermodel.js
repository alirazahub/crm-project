// backend/models/usermodel.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  password: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  previousPasswords: { type: [String], default: [] }
});

const User = mongoose.model("User", UserSchema);
export default User;
