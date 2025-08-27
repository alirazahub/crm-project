"use client";

import { use } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function StockOrders({ orders }) {
  //const orders = use(ordersPromise);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStatusChange = async (orderId) => {
  try {
    await api.put(`/update-order-status/${orderId}`, { status: "received" });
    router.refresh(); // 👈 forces server re-fetch
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">📦 Stock Orders</h2>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="text-gray-500 text-sm">No stock orders found</div>
      )}

      {/* Orders List */}
      <ul className="space-y-4 overflow-y-auto pr-2">
        {orders.map((order) => (
          <li
            key={order._id}
            className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Top section: order info + status */}
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-sm">
                Order #{order._id.slice(-6)}
              </p>

              <span
                className={`px-2 py-0.5 text-xs rounded-md font-medium ${
                  order.status === "received"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Date */}
            <p className="text-xs text-gray-500 mb-3">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {/* Products */}
            <div className="space-y-1 mb-3">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{item.product?.name}</span>
                  <span>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Action button */}
            {order.status !== "received" && (
              <button
                onClick={() => handleStatusChange(order._id)}
                className="w-full px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Mark as Received
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
