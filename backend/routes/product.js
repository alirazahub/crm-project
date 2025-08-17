import express from "express";
import Product from "../models/productModel.js";
const router = express.Router();

// --------Creates a new product and saves it to the database
router.post("/createproduct", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct); // Send back the created product with a 201 status
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const errors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));
      return res.status(400).json({ message: "Validation Error", errors });
    }
    console.error("Error saving product:", error);
    res
      .status(500)
      .json({ message: "Server error occurred while saving the product." });
  }
});

//get all
router.get("/productlist", async (req, res) => {
  try {
    const product = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "error at fetching product" });
  }
});
//get by id
router.get("/productlist/:id", async (req, res) => {
  console.log("get route hit ");
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "error at fetching product" });
  }
});
//delete by id
router.delete("/productlist/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error at deleting product" });
  }
});

//edit product by id
router.post("/productlist/:id", async (req, res) => {
  const { name, description, category, brand, price } = req.body;
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        brand,
        price,
      },
      { new: true }
    );
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "error at fetching product" });
  }
});

export default router;
