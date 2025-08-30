'use client';

import { fetchProducts } from "@/store/slices/productSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { placeStockOrder } from "@/store/slices/orderSlice";
import { ImageIcon, Plus, Minus, X } from "lucide-react";


export default function InventoryProducts({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(10);

  const stockQty = product.stock?.quantity ?? 0;
  const lowStock = product.stock?.lowStockThreshold ?? 10;
  const isLow = stockQty <= lowStock;

  const handlePlaceOrder = (product, qty) => {
    console.log(`Placing stock order for product: ${product._id}, qty: ${qty}`);
    dispatch(
      placeStockOrder({
        productId : product._id,
        quantity: qty,
        price: product.price,
      })
    );
    router.refresh();
    setOpen(false);
    setQuantity(10); // reset after placing
  };

  const openOrderModal = () => {
    setQuantity(10);
    setOpen(true);
  };

  return (
    <div className="p-6">
      {/* Stock Status */}
      <div className="mt-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          Stock: {product.stock?.quantity ?? 0}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          Sold: {product.stock?.sold ?? 0}
        </p>
      </div>

      {/* Place Stock Order Button */}
      <div className="mt-5">
        <Button
          onClick={() => openOrderModal()}
          className="w-full rounded-xl"
          variant={isLow ? "destructive" : "default"}
        >
          {isLow ? "⚠ Restock Now" : "Place Stock Order"}
        </Button>
      </div>

      {/* Custom Modal */}
      {open && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative text-gray-900">
      {/* Close Button */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <X size={20} />
      </button>

      {/* Modal Header */}
      <h2 className="text-xl font-semibold mb-4">
        Place Stock Order for {product.name}
      </h2>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center gap-6 py-6">
        <button
          className="p-3 rounded-full border hover:bg-gray-100"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          <Minus size={20} />
        </button>

        <span className="text-3xl font-bold">{quantity}</span>

        <button
          className="p-3 rounded-full border hover:bg-gray-100"
          onClick={() => setQuantity((q) => q + 1)}
        >
          <Plus size={20} />
        </button>
      </div>

      
      <Button
        onClick={() => handlePlaceOrder(product, quantity)}
        className="w-full rounded-xl mt-2"
        variant="secondary"
      >
        Place Stock Order
      </Button>
    </div>
  </div>
)}

    </div>
  );
}
