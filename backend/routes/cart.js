import express from "express";
import Cart from "../models/cartModel.js";
import Product from "../models/productmodel.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ correct import

const router = express.Router();


router.get("/user", protect, async (req, res) => {   
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.status(200).json({ message: "Cart is empty", items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});


router.post("/add-item", protect,async (req, res) => {  
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddition: product.price
      });
    }

    await cart.save();
    await cart.populate("items.product","name price image"); 
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});


router.put("/update-item/:productId",protect,  async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();
        await cart.populate("items.product","name price image"); 
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item" });
  }
});


router.delete("/remove-item/:productId",protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    await cart.save();   
     await cart.populate("items.product","name price image"); 
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart" });
  }
});


router.delete("/clear-cart", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

export default router;
