import express from 'express' ;
import User  from '../models/usermodel.js' ;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {authorize}  from '../middleware/authorization.js';
import { protect } from '../middleware/authMiddleware.js';
dotenv.config();


const router = express.Router() ;

const generateToken = (id , role) => {
  console.log('Generating token for user ID:', id);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
  console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
  
  const token = jwt.sign({ id , role  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  console.log('Generated token:', token);
  return token;
};

router.post('/sign-in', async (req , res)=>{
    console.log(" inside simple sign in route Login request body:", req.body);
    try{
    const { email , password } = req.body ;

    const user = await User.findOne({email}) ;

    //if email isnt in database or passwords dont match 
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      success: true,
       token,
      user: { role: user.role , name: user.fullname, email: user.email } 
    });
}catch(err){
    console.log('error in sign in ' , err) ;
}
        
    
});

router.post("/google-sign-in", async (req, res) => {
      console.log(' entered google sign in route' , err) ;

  try {
    const { name, email, image } = req.body;
    console.log('fetch name email image from body in google signup route' , err) ;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        fullname: name,
        email: email,
      });
      await user.save();
      console.log("✅ New Google user created:", email);
    } else {
      console.log("✅ Existing Google user signed in:", email);
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send success response with token
    res.status(200).json({
      success: true,
      message: "Google sign-in successful",
     token, 
      user: {
        id: user._id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        image: image
      }
    });

  } catch (error) {
    console.error("❌ Google sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during Google sign-in",
      error: error.message
    });
  }
});

router.get('/admin' , authorize , (req, res)=>{
    return res.status(200).json({
         message: "Welcome Admin!"
    }) ;
} )

router.post('/auth/logout' , (req , res)=>{
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
})

router.get('/auth/me', protect , (req, res)=>{
  console.log(req.user) ;
  res.json(req.user);
});


export default router;
