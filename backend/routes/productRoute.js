import express from "express";
import Product from "../models/productModel.js";
import authorize from "../middleware/authorization.js";
import handleMulterErrors from "../middleware/multer.js";

const router = express.Router();

function safeParseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value; // already array
  try {
    return JSON.parse(value); // try JSON
  } catch {
    // fallback: split comma-separated strings
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
}

function safeParseObject(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === "object") return value; // already an object
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}



router.post("/createproduct", authorize, handleMulterErrors, async (req, res) => {
  try {
    console.log("Incoming product data:", req.body);

    // Parse fields back to correct types
    const productData = {
      ...req.body,
      tags: safeParseArray(req.body.tags),
  discount: safeParseObject(req.body.discount, {}),
  stock: safeParseObject(req.body.stock, {}),

      price: req.body.price ? Number(req.body.price) : 0,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : 0,
      costPrice: req.body.costPrice ? Number(req.body.costPrice) : 0,

      isFeatured: req.body.isFeatured === "true",

      images: req.files?.map((file) => file.path) || [],
    };

    console.log("Final parsed productData:", productData);

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Server error occurred while saving the product." });
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
router.delete("/productlist/:id", authorize,async (req, res) => {
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


router.put("/productlist/:id", handleMulterErrors, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fields that might come as JSON string
    const fieldsToParse = ["discount", "stock", "ratings", "tags"];

    fieldsToParse.forEach((field) => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          // leave as-is if parsing fails
        }
      }
    });

    // Handle images
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }
    const uploadedImages = req.files?.map((file) => file.path) || [];
    const finalImages = [...existingImages, ...uploadedImages];

    const productData = {
      ...req.body,
      images: finalImages.length > 0 ? finalImages : [], // ensure array
    };

    // Null or empty string safety
    Object.keys(productData).forEach((key) => {
      if (
        productData[key] === "null" ||
        productData[key] === "undefined" ||
        productData[key] === ""
      ) {
        productData[key] = null;
      }
    });

    product.set(productData);
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Error updating product" });
  }
});


export default router;
