"use client";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder, resetOrderState, fetchMyOrder } from "@/store/slices/orderSlice";
import { useState, useEffect } from "react";
import { removeFromCart } from "@/store/slices/cartSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { cart, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { currentOrder, status, successMessage, error , buyNowProduct} = useSelector((state) => state.order);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });



  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleCheckout = (e) => {
  e.preventDefault();

 
    if (buyNowProduct) {
      // ✅ Place order for single product
      dispatch(
        placeOrder({
          items: [{ productId: buyNowProduct._id, quantity: 1 }],
          shippingDetails: form,
          
        })
      );
    } else {
      // ✅ Place order for all cart items
      dispatch(
        placeOrder({
          items: cart.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingDetails: form,
        })
      );
    }
  };


// After successful order:

useEffect(() => {
  if (successMessage) {
    if (buyNowProduct) {
      // ✅ Remove only the Buy Now product
      dispatch(removeFromCart(buyNowProduct._id));
    } else {
      // ✅ Remove all cart items
      cart.forEach((item) => {
        dispatch(removeFromCart(item.product ? item.product._id : item._id));
      });
    }

    // Reset order state after a delay
    setTimeout(() => dispatch(resetOrderState()), 3000);
  }
}, [successMessage, dispatch, buyNowProduct, cart]);


   // ✅ Decide what to show
  const checkoutItems = buyNowProduct ? [buyNowProduct] : cart;
  const checkoutTotal = buyNowProduct
    ? buyNowProduct.price * 1
    : totalPrice;
  const checkoutQuantity = buyNowProduct ? 1 : totalQuantity;


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold border-b pb-3">Order Summary</h2>
          <ul className="divide-y mt-4">
            {checkoutItems.map((item) => (
              <li key={item.product ? item.product._id : item._id} className="py-3 flex justify-between">
                <span>
                  {item.product ? item.product.name : item.name} × {item.quantity || 1}
                </span>
                <span>
                  $
                  {(
                    (item.product ? item.product.price : item.price) *
                    (item.quantity || 1)
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-3">
            <span>Total ({checkoutQuantity} items)</span>
            <span>${checkoutTotal.toFixed(2)}</span>
          </div>
        </div>


        {/* Checkout Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold border-b pb-3">Shipping Details</h2>
          <form onSubmit={handleCheckout} className="space-y-4 mt-4">
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded-lg"/>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-3 border rounded-lg"/>
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full p-3 border rounded-lg"/>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full p-3 border rounded-lg"/>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-lg"/>

            <button type="submit" disabled={status === "loading"} className="w-full px-6 py-3 bg-black text-white font-semibold rounded-xl shadow-md hover:bg-zinc-700 transition">
              {status === "loading" ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {successMessage && <p className="mt-4 text-center text-green-700">{successMessage}</p>}
          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
