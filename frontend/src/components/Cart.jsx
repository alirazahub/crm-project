"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";


export default function Cart() {
  const dispatch = useDispatch();
    const router = useRouter();


  const { cart, totalQuantity, totalPrice } = useSelector((state) => state.cart);

  return (
    
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">🛒 My Cart</h1>

        {/* Summary */}
        <div className="flex justify-between items-center mt-4 text-gray-700">
          <p className="text-lg">Total Items: <span className="font-semibold">{totalQuantity}</span></p>
          <p className="text-lg">Total Price: <span className="font-semibold">${totalPrice.toFixed(2)}</span></p>
        </div>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-lg">Your cart is empty</p>
        ) : (
          <div className="mt-6 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id || item.product}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{item.product.name || "Unknown Product"}</h2>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(removeFromCart(item.product._id))}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Cart Button */}
        {cart.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => dispatch(clearCart())}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition"
            >
              Clear Cart
            </button>
        {/* Checkout Button */}

             <button
             onClick={() => router.push("/customer/checkout")}  
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
