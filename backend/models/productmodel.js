// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,

      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },

    // Category & Classification
    category: {
      type: String,
      enum: [
        "Hoodies",
        "Tshirts",
        "Jackets",
        "Leader Jackets",
        "Denim Jackets",
      ],
    },

    subcategory: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Pricing
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },

    costPrice: {
      type: Number,
      min: [0, "Cost price cannot be negative"],
    },

    // Discounts
    discount: {
      percentage: {
        type: Number,
        min: [0, "Discount percentage cannot be negative"],
        max: [100, "Discount percentage cannot exceed 100"],
      },
      amount: {
        type: Number,
        min: [0, "Discount amount cannot be negative"],
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },

    // Inventory
    stock: {
      quantity: {
        type: Number,
        min: [0, "Stock cannot be negative"],
        default: 0,
      },
      sold: {
        type: Number,
        min: [0, "Sold count cannot be negative"],
        default: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      trackInventory: {
        type: Boolean,
        default: true,
      },
    },

    // Images
    images: [
      {
        type: String,
      },
    ],

    // Status & Visibility
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "archived"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Reviews & Ratings
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Admin Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const product = mongoose.model("Product", productSchema);
export default product;
