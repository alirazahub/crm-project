"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { cart, totalQuantity, totalPrice } = useSelector(
    (state) => state.cart
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 shadow-md shadow-gray-400">
          <div className="flex items-center justify-between ">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl ">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
              </div>
              Shopping Cart
            </h1>
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {totalQuantity} item{totalQuantity !== 1 && "s"}
              </span>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 shadow-md shadow-gray-400">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Discover amazing products and add them to your cart
              </p>
              <button
                onClick={() => router.push("/filter")}
                className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product._id || item.product}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 shadow-md shadow-gray-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.product.name || "Unknown Product"}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        ${item.product.price?.toFixed(2) || "0.00"} each
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button
                            onClick={() =>
                              dispatch(removeFromCart(item.product._id))
                            }
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(addToCart(item.product))}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">Qty</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        $
                        {((item.product.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          dispatch(removeFromCart(item.product._id))
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 ">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 shadow-md shadow-gray-400">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 ">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/customer/checkout")}
                    className="w-full px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-all duration-200 shadow-md shadow-gray-300"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => router.push("/filter")}
                    className="w-full px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all duration-200 shadow-md shadow-gray-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
