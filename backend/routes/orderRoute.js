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

    // For normal user → return their latest order
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("items.product", "name price");

    res.json(orders[0] || null);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

// GET total revenue
router.get('/total-revenue', async (req, res) => {
  try {
    const totalRevenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ["paid", "shipped", "delivered", "received"] } // Only consider completed orders for revenue
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET total sales (count of completed orders)
router.get('/total-sales', async (req, res) => {
  try {
    const totalSales = await Order.countDocuments({
      status: { $in: ["paid", "shipped", "delivered", "received"] } // Only count completed orders as sales
    });
    res.status(200).json({ totalSales });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
