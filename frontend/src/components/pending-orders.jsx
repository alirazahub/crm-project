'use client';

import { useEffect, useState } from "react";
import api from "@/utils/api"; // Assuming this is an Axios instance

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/get-pending-orders');
      console.log(res.data) ;
      setOrders(res.data || []);
      
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {

  fetchOrders(); // ✅ Call the async function inside useEffect
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pending Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-600">No pending orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white shadow-md rounded-lg p-6 mb-6 border">

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Items:</h3>
              <ul className="space-y-1">
                {order.items?.map((item) => (
                  <li key={item._id} className="bg-gray-100 p-2 rounded">
                    <div><span className="font-medium">Product Name:</span> {item.product.name}</div>
                    <div><span className="font-medium">Quantity:</span> {item.quantity}</div>
                    <div><span className="font-medium">Price:</span> ${item.price}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-2">
              <span className="font-semibold">Total Price:</span> ${order.totalPrice?.toFixed(2)}
            </div>
            
            <div className="mb-2">
              <span className="font-semibold">Shipping Address:</span> {order.shippingDetails?.address || "N/A"}
            </div>

            <div className="mb-4">
              <span className="font-semibold">Status:</span>{" "}
              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                order.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
              }`}>
                {order.status}
              </span>
            </div>

            {order.status === "pending" && (
              <button
                onClick={() => handleStatusChange(order._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
