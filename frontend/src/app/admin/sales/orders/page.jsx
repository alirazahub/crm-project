'use client';

import { useState } from "react";
import DeliveredOrders from "@/components/delivered-orders";
import PendingOrders from "@/components/pending-orders";

export default function Orders() {
  const [showDelivered, setShowDelivered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gray-50">
      {/* Button group */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setShowDelivered(true)}
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            showDelivered
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Delivered/Dispatched
        </button>
        <button
          onClick={() => setShowDelivered(false)}
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            !showDelivered
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
          }`}
        >
          Pending
        </button>
      </div>

      {/* Order list */}
      <div className="w-full max-w-5xl">
        {showDelivered ? <DeliveredOrders /> : <PendingOrders />}
      </div>
    </div>
  );
}
