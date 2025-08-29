"use client";

import { useState } from "react";
import DeliveredOrders from "@/components/delivered-orders";
import PendingOrders from "@/components/pending-orders";
import AdminSidebar from "@/components/AdminSideBar";
import AdminHeader from "@/components/AdminHeader";

export default function Orders() {
  const [showDelivered, setShowDelivered] = useState(false);

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
        {/* Content */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* Added styling to mimic the TrackRoles content area's general look */}
          <div className="flex flex-col min-h-[80vh] space-y-6 w-full max-w-6xl mx-auto">
            <div className="mb-4 text-center">
              {" "}
              {/* Adjusted margin-bottom */}
              <h1 className="text-3xl font-bold text-slate-100 mb-2">
                Orders Management
              </h1>
              <p className="text-slate-400">
                Switch between Pending and Delivered/Dispatched orders
              </p>
            </div>

            {/* Button group */}
            <div className="flex justify-center space-x-4 mb-4">
              {" "}
              {/* Adjusted margin-bottom */}
              <button
                onClick={() => setShowDelivered(true)}
                className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-300 border ${
                  showDelivered
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-800/50 text-slate-200 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                }`}
              >
                Delivered / Dispatched
              </button>
              <button
                onClick={() => setShowDelivered(false)}
                className={`px-6 py-2 rounded-lg font-semibold shadow transition-all duration-300 border ${
                  !showDelivered
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-800/50 text-slate-200 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                }`}
              >
                Pending
              </button>
            </div>

            {/* Orders List */}
            {/* Added backdrop-blur-sm for the glassmorphic effect */}
            <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg p-6 backdrop-blur-sm flex-grow">
              {showDelivered ? <DeliveredOrders /> : <PendingOrders />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
