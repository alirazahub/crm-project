import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const authorize = async (req, res, next) => {
  let token = req.cookies?.token; 
  // Check for token in Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token from Authorization header:', token);
  } else if (req.cookies.token) {
    console.log(req.cookies) ;
    token = req.cookies.token;
    console.log('Token from cookie:', token);
  }
  
  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log('User not found in database for ID:', decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    if(req.user.role != 'admin')
    {
    console.log('User not authorized:', decoded.id);
    return res.status(401).json({ message: "Not authorized" });
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    console.error('Error details:', error);
    res.status(403).json({ message: "Access denied" });
  }
};
