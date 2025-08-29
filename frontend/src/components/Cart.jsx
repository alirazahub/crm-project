"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cart, totalQuantity, totalPrice } = useSelector((state) => state.cart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-5">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-zinc-900" /> My Cart
          </h1>
          <span className="text-sm font-medium text-gray-500">
            {totalQuantity} item{totalQuantity !== 1 && "s"}
          </span>
        </div>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">🛒 Your cart is empty</p>
            <button
              onClick={() => router.push("/customer/homepage")}
              className="mt-6 px-6 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div
                  key={item.product._id || item.product}
                  className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-lg transition"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.product.name || "Unknown Product"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Quantity: <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p className="text-sm text-gray-800 mt-1 font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="mt-8 bg-gray-50 p-6 rounded-2xl shadow-sm flex justify-between items-center">
              <div>
                <p className="text-lg text-gray-700">
                  Total Price:{" "}
                  <span className="font-bold text-gray-900">
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => router.push("/customer/checkout")}
                  className="px-6 py-3 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition"
                >
                  Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
