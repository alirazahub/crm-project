import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  
import forgetPswdRoute from "./routes/forget-pswd.js";  
import User from "./models/usermodel.js";   
import Product from "./models/productModel.js";    
import userRoutes from './routes/register.js'; // Import the user registration routes
import signInRoute from './routes/sign-in.js';
import productRoute from './routes/product.js';
import googleSignInRoute from './routes/google-sign-in.js';

const app = express();
app.use(express.json()); 

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send("Welcome to the CRM backend API server is running at port 3000");
});


app.use(signInRoute);
app.use(userRoutes);
app.use("/api/product", productRoute);
app.use(forgetPswdRoute);   
app.use(googleSignInRoute); // Add Google sign-in route
 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log("✅  MONGODB Connected successfully");
    
  })
  .catch(err => {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  });


const runFunction = () => {
  console.log(`Server is running on port ${process.env.PORT}`);
};

app.listen(process.env.PORT, runFunction);
