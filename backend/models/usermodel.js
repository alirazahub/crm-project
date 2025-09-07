// backend/models/usermodel.js
import mongoose from "mongoose";
import bcrypt from 'bcrypt' ;

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["user", "admin" , "sales" , "manager"], default: "user" },
  password: { type: String, required: false }, // Made optional for Google user
  createdAt: { type: Date, default: Date.now },
  previousPasswords: { type: [String], default: [] }
});

// // Hash password before save
// UserSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
UserSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
