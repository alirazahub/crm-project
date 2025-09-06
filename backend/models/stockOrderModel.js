import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const stockOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [orderItemSchema],
    shippingDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true }
    },
    //added received status for stock confirmation from admin side
    status: {
      type: String,
      enum: ["pending" , "cancelled" , "received"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const StockOrder = mongoose.model("StockOrder", stockOrderSchema);
export default StockOrder;
