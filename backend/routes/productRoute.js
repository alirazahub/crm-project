import express from "express";
import Product from "../models/productModel.js";
import { authorize} from "../middleware/authorization.js";
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
    // Fields that might come as JSON strings
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
    const uploadedImages = req.files?.map((file) => file.path) || [];
    const productData = {
      ...req.body,
      images: uploadedImages.length > 0 ? uploadedImages : [],
    };

    // Convert numeric fields (force to number or null)
    ["price", "originalPrice", "costPrice"].forEach((numField) => {
      if (productData[numField] !== undefined && productData[numField] !== null) {
        const val = Number(productData[numField]);
        productData[numField] = isNaN(val) ? null : val;
      }
    });

    // Convert stock.quantity
    if (productData.stock?.quantity !== undefined) {
      const qty = Number(productData.stock.quantity);
      productData.stock.quantity = isNaN(qty) ? null : qty;
    }

    // Convert discount fields
    if (productData.discount) {
      ["percentage", "amount"].forEach((field) => {
        const val = Number(productData.discount[field]);
        productData.discount[field] =
          productData.discount[field] === "" || isNaN(val) ? null : val;
      });

      ["startDate", "endDate"].forEach((field) => {
        productData.discount[field] =
          !productData.discount[field] || productData.discount[field] === ""
            ? null
            : new Date(productData.discount[field]);
      });
    }

    // Booleans
    if (productData.isFeatured !== undefined) {
      productData.isFeatured =
        productData.isFeatured === "true" || productData.isFeatured === true;
    }

    // Null cleanup for any leftover empty strings
    Object.keys(productData).forEach((key) => {
      if (
        productData[key] === "null" ||
        productData[key] === "undefined" ||
        productData[key] === ""
      ) {
        productData[key] = null;
      }
    });

    console.log("Final product data to save:", productData);
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error.message);
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
