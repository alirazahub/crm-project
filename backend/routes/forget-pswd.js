import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from"../models/usermodel.js"
const router=express.Router();

router.post('/forget-pswd', async (req,res)=>{
const {email}=req.body;
try{ 
const user=await User.findOne({email});
if(!user) return res.status(404).json({message:"invalid user"});
const token=jwt.sign( {id:user._id},"mshafqaat",{expiresIn:"20m"});
const reset=`http://localhost:3000/reset-pswd/${token}`;
console.log(reset);
res.json({message:'link send',reset});}
catch (err) {
    res.status(500).json({ message: "Server error"});
  }
});


router.post('/reset-pswd/:token', async (req,res)=>{
const {token}=req.params;
const {password}=req.body;
try{
let decoded=jwt.verify(token,'mshafqaat');
const hashedpassword=await bcrypt.hash(password,10);
let user= await User.findById(decoded.id);
if (!user) return res.status(404).json({ message: "User not found" });
user.password=hashedpassword;
await user.save();
res.json({ message: "Password reset" });
}
catch(err){
 res.status(400).json({ message: "Invalid or expired token" });
}

}
);

export  default router; 