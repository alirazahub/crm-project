// backend/routes/orderRoutes.js
import express from "express";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Order (Checkout)
router.post("/", protect, async (req, res) => {
  try {
    const { shippingDetails } = req.body;

    // Find user’s cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.priceAtAddition
    }));

    const totalPrice = cart.totalPrice;

    // Create new order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingDetails,
      totalPrice
    });

    await order.save();
console.log("Saved order:", order);

    // Clear cart after order
// Clear cart after order



  
    // Clear cart after order
const freshCart = await Cart.findOne({ user: req.user._id });
if (freshCart) {
  freshCart.items = [];
  freshCart.totalPrice = 0;
  await freshCart.save();
}


    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Error placing order" });
  }
});
// Get logged-in user's latest order
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders[0]); // send latest order
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

export default router;
