import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/register.js"; // Import the user registration routes
import signInRoute from './routes/sign-in.js'

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors({
  origin: 'http://localhost:3000', // 👈 Allow your frontend origin
  credentials: true, // if you're using cookies or sessions
}));
app.use(express.json());

app.use(signInRoute) ;

app.use(cors()); // allow all origins
app.use("/register", userRoutes);
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
