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

const app = express();
app.use(express.json()); 

dotenv.config();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send("Welcome to the CRM backend API");
});


app.use(signInRoute);
app.use(userRoutes);
app.use("/api/product", productRoute);
app.use(forgetPswdRoute);   
 
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
     



const runFunction = () => {
  console.log(`Server is running on port ${process.env.PORT}`);
};

app.listen(process.env.PORT, runFunction);
