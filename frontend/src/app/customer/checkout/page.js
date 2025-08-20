"use client";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder, resetOrderState, fetchMyOrder } from "@/store/slices/orderSlice";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { cart, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const { currentOrder, status, successMessage, error } = useSelector((state) => state.order);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
/*
const handleCheckout = (e) => {
  e.preventDefault();

  dispatch(placeOrder({
    shippingDetails: form,
    items: cart.map((item) => ({
      product: item.product._id || item.product, // ensure you send product id
      quantity: item.quantity,
      priceAtAddition: item.product.price, // optional, but useful
    })),
    totalPrice
  }));
};*/
const handleCheckout = (e) => {
  e.preventDefault();
  dispatch(placeOrder({ shippingDetails: form }));
};



  useEffect(() => {
    dispatch(fetchMyOrder());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => dispatch(resetOrderState()), 3000);
    }
  }, [successMessage, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold border-b pb-3">Order Summary</h2>
          <ul className="divide-y mt-4">
            {cart.map((item) => (
              <li key={item.product._id} className="py-3 flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold text-lg mt-4 border-t pt-3">
            <span>Total ({totalQuantity} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
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

            <button type="submit" disabled={status === "loading"} className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition">
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
