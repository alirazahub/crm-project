"use client"

import { useEffect, useState } from "react"
import api from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, CheckCircle, Truck, AlertCircle, Eye } from "lucide-react"

export default function DeliveredOrders({
  searchTerm = "",
  selectedStatus = "All Statuses",
  sortBy = "createdAt",
  sortOrder = "desc",
  onOrderUpdate,
}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrders, setExpandedOrders] = useState(new Set())

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get("/get-dispatched-orders")
      setOrders(res.data || [])
      if (onOrderUpdate) {
        onOrderUpdate()
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId) => {
    try {
      await api.put(`/update-order-status/${orderId}`, {
        status: "delivered",
        type: "customer",
      })
      await fetchOrders()
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to update order status: " + err.message)
    }
  }

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500"
      case "shipped":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "shipped":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }
  }

  const filteredOrders = orders
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Truck className="h-4 w-4 text-cyan-500" />
          Delivered & Shipped Orders
        </h3>
        <span className="text-xs text-slate-500">{filteredOrders.length} orders</span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="text-red-400 h-4 w-4" />
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <div className="bg-slate-800/30 border-b border-slate-700/50">
            <div className="grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-slate-400">
              <div className="col-span-3">Order</div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-2">Items</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          <div className="divide-y divide-slate-700/30">
            {filteredOrders.map((order) => (
              <div key={order._id}>
                <div className="grid grid-cols-12 gap-3 items-center text-xs text-slate-300 px-3 py-3 hover:bg-slate-800/30">
                  <div className="col-span-3 flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(order.status)} mr-2`}></div>
                    <span className="font-mono text-cyan-400 truncate">{order._id}</span>
                  </div>
                  <div className="col-span-2 truncate">{order.user?.fullname || "N/A"}</div>
                  <div className="col-span-1 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {order.items?.length || 0}
                  </div>
                  <div className="col-span-1 font-semibold text-green-400">${order.totalPrice?.toFixed(2)}</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className={`${getStatusBadge(order.status)} text-xs`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <Eye className="h-3 w-3 text-slate-400" />
                    </button>
                    {order.status === "shipped" && (
                      <Button
                        onClick={() => handleStatusChange(order._id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-6 px-2 text-xs"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {expandedOrders.has(order._id) && (
                  <div className="bg-slate-800/20 border-t border-slate-700/30 px-3 py-3">
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-medium text-slate-300 mb-2 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Items
                        </h4>
                        <div className="space-y-1">
                          {order.items?.map((item) => (
                            <div
                              key={item._id}
                              className="bg-slate-700/30 p-2 rounded border border-slate-700/50 flex justify-between items-center"
                            >
                              <div>
                                <div className="text-slate-200 text-xs">
                                  {item.product ? item.product.name : "Unknown Product"}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  Qty: {item.quantity} • ${item.price?.toFixed(2)}
                                </div>
                              </div>
                              {item.product?.images && item.product.images.length > 0 && (
                                <img
                                  src={item.product.images[0] || "/placeholder.svg"}
                                  alt={item.product.name}
                                  className="w-6 h-6 object-cover rounded border border-slate-600"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-300 mb-2">Shipping</h4>
                        <div className="bg-slate-700/30 p-2 rounded border border-slate-700/50">
                          <div className="text-slate-300 text-xs break-words">
                            {order.shippingDetails?.address || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-900/30 rounded-lg border border-slate-700/50">
          <Truck className="mx-auto text-slate-500 mb-2 h-8 w-8" />
          <h3 className="text-sm font-medium text-slate-300 mb-1">No orders found</h3>
          <p className="text-xs text-slate-500">
            {searchTerm || selectedStatus !== "All Statuses"
              ? "Try adjusting your search or filters"
              : "Delivered and shipped orders will appear here."}
          </p>
        </div>
      )}
    </div>
  )
}
