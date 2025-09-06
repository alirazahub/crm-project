"use client"

import { useState, useEffect } from "react"
import api from "@/utils/api"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Calendar, Search, Filter, ChevronDown, Loader2, AlertCircle } from "lucide-react"
import Loader from "@/components/loader"
import MetricCard from "@/components/MetricCard"

export default function AllUsers() {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)

  const fetchAllUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/all-users")
      setAllUsers(response.data || [])
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setError("Failed to load users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  // Filter and Sort Logic
  const filteredAndSortedUsers = allUsers
    .filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdAt") {
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
  const totalUsers = allUsers.length || 0
  const activeUsers = allUsers.filter((u) => u.isActive !== false).length || 0
  const inactiveUsers = allUsers.filter((u) => u.isActive === false).length || 0
  const recentUsers =
    allUsers.filter((u) => {
      const userDate = new Date(u.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return userDate >= weekAgo
    }).length || 0

   if (loading) {
     return (
       <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
         <div className="flex flex-col items-center">
           <Loader />
           <p className="text-lg text-slate-300 mt-4">Loading users...</p>
         </div>
       </div>
     )
   }

  return (
    <>
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
          <div className="flex flex-col min-h-[80vh] w-full mx-auto">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden animate-fadeInUp">
              <CardHeader className="border-b border-slate-700/50 pb-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-cyan-500" />
                    All Registered Users
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>

            <div className="p-6 mb-8 border border-slate-700/50 animate-slideInUp">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                  <MetricCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    color="cyan"
                    detail="All registered users"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                  <MetricCard
                    title="Active Users"
                    value={activeUsers}
                    icon={UserCheck}
                    color="green"
                    detail="Currently active"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
                  <MetricCard
                    title="Inactive Users"
                    value={inactiveUsers}
                    icon={UserX}
                    color="red"
                    detail="Currently inactive"
                    unit=""
                  />
                </div>
                <div className="animate-fadeInUp" style={{ animationDelay: "400ms" }}>
                  <MetricCard
                    title="New This Week"
                    value={recentUsers}
                    icon={Calendar}
                    color="blue"
                    detail="Registered recently"
                    unit=""
                  />
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4 animate-fadeInUp"
                style={{ animationDelay: "600ms" }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search users (name, email, username...)"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mt-4 bg-slate-800/30 rounded-xl border border-slate-700/30 shadow-inner animate-slideInUp">
                  <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 focus:scale-[1.02] transform"
                    >
                      <option value="createdAt" className="bg-slate-900 text-slate-100">
                        Registration Date
                      </option>
                      <option value="name" className="bg-slate-900 text-slate-100">
                        Name
                      </option>
                      <option value="email" className="bg-slate-900 text-slate-100">
                        Email
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

            <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg backdrop-blur-sm flex-grow animate-slideInUp">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 bg-slate-800/30 pl-8">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">User</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Username</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered</div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-700/30 pl-5">
                {filteredAndSortedUsers.map((user, index) => (
                  <div
                    key={user._id || index}
                    className="grid grid-cols-5 gap-4 p-4 hover:bg-slate-800/30 transition-all duration-300 animate-fadeInUp"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* User Column */}
                    <div className="flex items-center space-x-3 ">
                      <div className="w-8 h-8 bg-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-slate-100 font-medium text-xs">{user.fullname || "No Name"}</div>
                      </div>
                    </div>

                    {/* Email Column */}
                    <div className="flex items-center">
                      <span className="text-slate-300 text-xs truncate">{user.email || "No Email"}</span>
                    </div>

                    {/* Username Column */}
                    <div className="flex items-center">
                      <span className="text-slate-400 text-xs">{user.fullname || "No Username"}</span>
                    </div>

                    {/* Registration Date Column */}
                    <div className="flex items-center">
                      <span className="text-slate-400 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>

                    {/* Status Column */}
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${user.isActive !== false ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            user.isActive !== false ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAndSortedUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400 text-lg">No users found</p>
                  <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
