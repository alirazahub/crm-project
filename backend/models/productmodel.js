import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // ... your schema (no changes here)
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ✅ Fix: use existing model if already compiled
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
