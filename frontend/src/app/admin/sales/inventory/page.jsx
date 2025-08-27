// app/inventory/page.jsx

import InventoryProducts from "@/components/inventory-products";
import StockOrders from "@/components/stock-orders";
import { cookies } from "next/headers";
import api from "@/utils/api";

export default async function InventoryPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const orders = await api
    .get("/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Inventory Tracking</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left side - Products (3/4) */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4">
          <InventoryProducts />
        </div>

        {/* Right side - Orders (1/4) */}
        <div className="col-span-1 bg-gray-50 rounded-xl shadow p-4 h-[80vh] overflow-y-auto">
          <StockOrders orders={orders} />
        </div>
      </div>
    </div>
  );
}
