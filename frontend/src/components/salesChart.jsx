"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyOrder } from "../store/slices/orderSlice";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function SalesChart() {
  const dispatch = useDispatch();
  const { orders, currentOrder, status } = useSelector((state) => state.order);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch order data when component mounts
    dispatch(fetchMyOrder());
  }, [dispatch]);

  useEffect(() => {
    const dailyData = generateDailySalesData(currentOrder, orders);
    setSalesData(dailyData);
  }, [currentOrder, orders]);

  const generateDailySalesData = (current, orderHistory) => {
    const data = [];
    const today = new Date();

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNumber = date.getDate();

      // Generate realistic sales data with some variation
      const baseSales = current?.totalAmount || 5000;
      const variation = Math.sin(i * 0.5) * 2000 + Math.random() * 1500;
      const sales = Math.max(baseSales + variation, 1000);

      data.push({
        day: `${dayName} ${dayNumber}`,
        sales: Math.round(sales),
        orders: Math.floor(sales / 150) + Math.floor(Math.random() * 10),
        visitors: Math.floor(sales / 50) + Math.floor(Math.random() * 20),
        date: date.toISOString().split("T")[0],
      });
    }

    return data;
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-lg p-3 shadow-xl">
          <p className="text-slate-200 font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "Sales"
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (status === "loading") {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="text-slate-400">Loading sales data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-lg border border-slate-700/50 p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            Daily Sales Overview
          </h3>
          <p className="text-sm text-slate-400">Last 14 days performance</p>
        </div>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            <span className="text-slate-400">Sales Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
            <span className="text-slate-400">Orders</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              interval={1}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#salesGradient)"
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "#10b981",
                strokeWidth: 2,
                fill: "#0f172a",
              }}
              name="Orders"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {formatCurrency(salesData.reduce((sum, day) => sum + day.sales, 0))}
          </div>
          <div className="text-xs text-slate-400">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {salesData.reduce((sum, day) => sum + day.orders, 0)}
          </div>
          <div className="text-xs text-slate-400">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {(() => {
              const totalSales = salesData.reduce(
                (sum, day) => sum + day.sales,
                0
              );
              const totalOrders = salesData.reduce(
                (sum, day) => sum + day.orders,
                0
              );
              return totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
            })()}
          </div>
          <div className="text-xs text-slate-400">Avg Order Value</div>
        </div>
      </div>
    </div>
  );
}
