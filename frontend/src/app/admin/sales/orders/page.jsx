"use client"

import { useState, useEffect } from "react"
import DeliveredOrders from "@/components/delivered-orders"
import PendingOrders from "@/components/pending-orders"
import Loader from "@/components/loader" // Import custom loader component
import api from "@/utils/api" // Assuming you have an API utility
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  ShoppingCart,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react"

import MetricCard from "@/components/MetricCard"

export default function CustomerOrders() {
  const [showDelivered, setShowDelivered] = useState(true) // Default to delivered
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter and Sort states (centralized)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses") // This will filter *across* delivered/pending
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)

  const fetchAllOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch both dispatched and pending orders
      const [dispatchedRes, pendingRes] = await Promise.all([
        api.get("/get-dispatched-orders"),
        api.get("/get-pending-orders"),
      ])

      const combinedOrders = [...(dispatchedRes.data || []), ...(pendingRes.data || [])]
      setAllOrders(combinedOrders)
    } catch (err) {
      console.error("Failed to fetch all orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // Filter and Sort Logic for Metric Cards and passing to children
  const filteredAndSortedOrders = allOrders
    .filter((order) => {
      const matchesSearch =
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingDetails?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some((item) => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = selectedStatus === "All Statuses" || order.status === selectedStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "totalPrice") {
        aValue = Number.parseFloat(aValue) || 0
        bValue = Number.parseFloat(bValue) || 0
      } else if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Calculate values for Metric Cards
  const totalOrders = allOrders.length || 0
  const deliveredOrdersCount = allOrders.filter((o) => o.status === "delivered").length || 0
  const shippedOrdersCount = allOrders.filter((o) => o.status === "shipped").length || 0
  const pendingOrdersCount = allOrders.filter((o) => o.status === "pending").length || 0
  const totalRevenue =
    allOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + (Number.parseFloat(o.totalPrice) || 0), 0)
      .toFixed(2) || "0.00"

  const statusOptions = ["All Statuses", "delivered", "shipped", "pending"]

  if (loading) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-lg text-slate-300 mt-4">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Re-adding animations from DeliveredOrders for consistency */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
      `}</style>

      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
        <div className="container mx-auto p-4 relative z-10 max-w-7xl">
          <div className="flex flex-col min-h-[80vh]  w-full mx-auto">
            {/* Main Title Card */}
            {/* <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden animate-fadeInUp">
              <CardHeader className="border-b border-slate-700/50 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Package className="mr-2 h-5 w-5 text-cyan-500" />
                    Customer Orders Overview
                  </CardTitle>
                </div>
              </CardHeader>
            </Card> */}
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden animate-fadeInUp ">
              <CardHeader className="border-b border-slate-700/50 pb-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Package className="mr-2 h-5 w-5 text-cyan-500" />
                    Customer Orders Overview
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>

            <div className="p-6 mb-8 border border-slate-700/50   animate-slideInUp">
              {/* Metric Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                  <MetricCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingCart}
                    color="cyan"
                    detail="All customer orders"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                  <MetricCard
                    title="Delivered Orders"
                    value={deliveredOrdersCount}
                    icon={CheckCircle}
                    color="green"
                    detail="Successfully delivered"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
                  <MetricCard
                    title="Shipped Orders"
                    value={shippedOrdersCount}
                    icon={Truck}
                    color="blue"
                    detail="Currently in transit"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "400ms" }}>
                  <MetricCard
                    title="Pending Orders"
                    value={pendingOrdersCount}
                    icon={Clock}
                    color="yellow"
                    detail="Awaiting shipment"
                    unit=""
                  />
                </div>
                {/* Could add Total Revenue here or elsewhere if desired */}
                {/* <div className="animate-fadeInUp" style={{ animationDelay: "500ms" }}>
                  <MetricCard title="Total Revenue (Delivered)" value={totalRevenue} icon={DollarSign} color="emerald" detail="From delivered orders" unit="$" />
                </div> */}
              </div>

              {/* Filter and Search Section */}
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4 animate-fadeInUp"
                style={{ animationDelay: "600ms" }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search orders (ID, customer, product...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500 focus:scale-[1.02] transform"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border border-slate-700/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium transform hover:scale-105 ${
                    showFilters
                      ? "bg-cyan-600 text-white shadow-md"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Filter size={20} />
                  Filters
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-4 bg-slate-800/30 rounded-xl border border-slate-700/30 shadow-inner animate-slideInUp">
                  <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:scale-[1.02] transform"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status} className="bg-slate-900 text-slate-100">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:scale-[1.02] transform"
                    >
                      <option value="createdAt" className="bg-slate-900 text-slate-100">
                        Order Date
                      </option>
                      <option value="totalPrice" className="bg-slate-900 text-slate-100">
                        Total Price
                      </option>
                      <option value="customerName" className="bg-slate-900 text-slate-100">
                        Customer Name
                      </option>
                      <option value="status" className="bg-slate-900 text-slate-100">
                        Status
                      </option>
                    </select>
                  </div>
                  <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:scale-[1.02] transform"
                    >
                      <option value="asc" className="bg-slate-900 text-slate-100">
                        Ascending
                      </option>
                      <option value="desc" className="bg-slate-900 text-slate-100">
                        Descending
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-600/20 border border-red-700 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-md animate-fadeInUp">
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Button group for Delivered/Pending - styled as subtle tabs */}
            <div
              className="flex justify-center items-center space-x-6 mb-6 animate-fadeInUp border-b border-slate-700/30 pb-2"
              style={{ animationDelay: "700ms" }}
            >
              <button
                onClick={() => setShowDelivered(true)}
                className={`text-sm font-medium transition-all duration-300 pb-2 border-b-2 ${
                  showDelivered
                    ? "text-cyan-400 border-cyan-400"
                    : "text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                Delivered Orders
              </button>
              <button
                onClick={() => setShowDelivered(false)}
                className={`text-sm font-medium transition-all duration-300 pb-2 border-b-2 ${
                  !showDelivered
                    ? "text-cyan-400 border-cyan-400"
                    : "text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                Pending Orders
              </button>
            </div>

            {/* Orders List */}
            <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg p-6 backdrop-blur-sm flex-grow animate-slideInUp">
              {showDelivered ? (
                <DeliveredOrders
                  allOrders={filteredAndSortedOrders.filter((o) => o.status !== "pending")}
                  fetchOrders={fetchAllOrders} // Pass this down to allow re-fetching on status change
                />
              ) : (
                <PendingOrders
                  allOrders={filteredAndSortedOrders.filter((o) => o.status === "pending")}
                  fetchOrders={fetchAllOrders} // Pass this down to allow re-fetching on status change
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
