'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function StockOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/get-stock-orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch stock orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    try {
      await api.put(`/update-order-status/${orderId}`, { status: "received" , type:'stock' });
      fetchOrders() // Refresh the data
    } catch (error) {
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        console.error("Failed to update status:", error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-slate-100">📦 Stock Orders</h2>

      {orders.length === 0 ? (
        <div className="text-slate-400">No stock orders found.</div>
      ) : (
        <ul className="space-y-4 overflow-y-auto pr-2">
          {orders.map((order) => (
            <li
              key={order._id}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header Row */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-slate-100">
                  Order #{order._id.slice(-6)}
                </p>
                <span
                  className={`px-2 py-0.5 text-xs rounded-md font-semibold ${
                    order.status === "received"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Date & User Info */}
              <div className="text-sm text-slate-400 mb-3 space-y-1">
                <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                {order.user && (
                  <>
                  <p>Stock order placed by : </p>
                    <p>User: {order.user.fullname}</p>
                    <p>Email: {order.user.email}</p>
                  </>
                )}
              </div>

              {/* Items */}
              <div className="space-y-1 text-sm text-slate-200 mb-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.product?.name || "Unnamed Product"}</span>
                    <span className="text-slate-300">× {item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Action */}
              {order.status !== "received" && (
                <button
                  onClick={() => handleStatusChange(order._id)}
                  className="w-full px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Mark as Received
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
