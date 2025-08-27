import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import forgetPswdRoute from "./routes/forget-pswd.js";
import userRoutes from "./routes/signupRoute.js"; // Import the user registration routes
import signInRoute from "./routes/sign-in.js";
import productRoute from "./routes/productRoute.js";
import adminRoutes from "./routes/admin.js";
import cookieParser from "cookie-parser";
import cart from "./routes/cart.js";
import orderRoutes from "./routes/orderRoute.js";
import feedbackRoutes from "./routes/feedbackRoute.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the CRM backend API server is running at port 3000");
});

app.use("/api/feedback", feedbackRoutes);
app.use("/api", signInRoute);
app.use("/api", userRoutes);
app.use("/api", productRoute);
app.use(forgetPswdRoute);
app.use("/api", adminRoutes);
app.use("/api/cart", cart);
app.use("/api/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MONGODB Connected successfully");
  })
  .catch((err) => {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  });

const runFunction = () => {
  console.log(`Server is running on port ${process.env.PORT}`);
};

app.listen(process.env.PORT, runFunction);
