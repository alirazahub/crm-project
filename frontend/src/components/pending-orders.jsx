'use client';
'use client';

import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/get-pending-orders');
      console.log(res.data);
      setOrders(res.data || []);

    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleStatusChange = async (orderId) => {
  try {
    await api.put(`/update-order-status/${orderId}`, { status: "shipped" });
    fetchOrders();
  } catch (error) {
    // If backend sent 400 error with { error: "message" }
    if (error.response?.data?.error) {
      alert(error.response.data.error); // or show toast
    } else {
      console.error("Failed to update status:", error);
    }
  }
};


  return (
    <div className="p-4 sm:p-6"> {/* Adjusted padding */}
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Pending Orders</h2> {/* Changed to h2, adjusted text color */}

      {orders.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No pending orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}
               className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 mb-6 shadow-lg hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"> {/* Dark theme card styling */}

            <div className="grid md:grid-cols-2 gap-4 mb-4 text-slate-300"> {/* Grid for better layout */}
              <div><span className="font-semibold text-slate-200">Order ID:</span> {order._id}</div>
              <div><span className="font-semibold text-slate-200">Customer:</span> {order.customerName || "N/A"}</div> {/* Assuming a customerName field */}
              <div><span className="font-semibold text-slate-200">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</div> {/* Assuming createdAt */}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-slate-200 mb-2">Items:</h3>
              <ul className="space-y-2">
                {order.items?.map((item) => (
                  <li key={item._id} className="bg-slate-700/40 p-3 rounded text-slate-300 flex justify-between items-center"> {/* Dark theme item styling */}
                    <div>
                      <span className="font-medium text-slate-200">{item.product.name}</span> <br />
                      <span className="text-sm text-slate-400">Qty: {item.quantity} | Price: ${item.price?.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-2 text-slate-300">
              <span className="font-semibold text-slate-200">Total Price:</span> <span className="text-lg font-bold text-blue-400">${order.totalPrice?.toFixed(2)}</span>
            </div>

            <div className="mb-2 text-slate-300">
              <span className="font-semibold text-slate-200">Shipping Address:</span> {order.shippingDetails?.address || "N/A"}
            </div>

            <div className="mb-4">
              <span className="font-semibold text-slate-200">Status:</span>{" "}
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === "pending"
                  ? "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                  : "bg-green-600/20 text-green-300 border border-green-500/30" // Fallback, though we expect pending here
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => handleStatusChange(order._id)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
              >
                Mark as Shipped
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}