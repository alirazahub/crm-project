"use client"
import { useSelector, useDispatch } from "react-redux"
import { placeOrder, resetOrderState } from "@/store/slices/orderSlice"
import { useState, useEffect } from "react"
import { removeFromCart } from "@/store/slices/cartSlice"

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const { cart, totalQuantity, totalPrice } = useSelector((state) => state.cart)
  const { currentOrder, status, successMessage, error, buyNowProduct } = useSelector((state) => state.order)

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCheckout = (e) => {
    e.preventDefault()

    if (buyNowProduct) {
      // ✅ Place order for single product
      dispatch(
        placeOrder({
          items: [{ productId: buyNowProduct._id, quantity: 1 }],
          shippingDetails: form,
        }),
      )
    } else {
      // ✅ Place order for all cart items
      dispatch(
        placeOrder({
          items: cart.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingDetails: form,
        }),
      )
    }
  }

  // After successful order:
  useEffect(() => {
    if (successMessage) {
      if (buyNowProduct) {
        // ✅ Remove only the Buy Now product
        dispatch(removeFromCart(buyNowProduct._id))
      } else {
        // ✅ Remove all cart items
        cart.forEach((item) => {
          dispatch(removeFromCart(item.product ? item.product._id : item._id))
        })
      }

      // Reset order state after a delay
      setTimeout(() => dispatch(resetOrderState()), 3000)
    }
  }, [successMessage, dispatch, buyNowProduct, cart])

  // ✅ Decide what to show
  const checkoutItems = buyNowProduct ? [buyNowProduct] : cart
  const checkoutTotal = buyNowProduct ? buyNowProduct.price * 1 : totalPrice
  const checkoutQuantity = buyNowProduct ? 1 : totalQuantity

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span>Home</span>
            <span>/</span>
            <span>Cart</span>
            <span>/</span>
            <span className="text-black font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your order below</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Order Summary</h2>
              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {checkoutQuantity} {checkoutQuantity === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={item.product ? item.product._id : item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black text-sm">
                        {item.product ? item.product.name : item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">
                      ${((item.product ? item.product.price : item.price) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${checkoutTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-black pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>${checkoutTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Shipping Information</h2>

            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-black mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-black mb-2">
                  Address *
                </label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-black mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-semibold text-black mb-2">
                    Postal Code *
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="12345"
                    required
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 px-6 bg-black text-white font-bold rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md text-lg"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  `Complete Order • $${checkoutTotal.toFixed(2)}`
                )}
              </button>
            </form>

            {successMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-semibold text-center">{successMessage}</p>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-semibold text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
