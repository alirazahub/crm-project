"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Search,
  Download,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

export default function SalesReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({
    platform: "",
    status: "",
    dateRange: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data - replace with actual API call
  const mockReports = [
    {
      id: "1",
      platform: "WhatsApp",
      salesCount: 25,
      revenue: 2500.0,
      date: "2024-08-28",
      notes:
        "Strong performance with high conversion rate from WhatsApp Business messaging",
      createdAt: "2024-08-28T10:30:00Z",
      updatedAt: "2024-08-28T10:30:00Z",
      status: "approved",
    },
    {
      id: "2",
      platform: "Instagram",
      salesCount: 18,
      revenue: 1800.5,
      date: "2024-08-27",
      notes: "Good engagement from story ads and reels",
      createdAt: "2024-08-27T14:20:00Z",
      updatedAt: "2024-08-27T16:45:00Z",
      status: "submitted",
    },
    {
      id: "3",
      platform: "Facebook",
      salesCount: 32,
      revenue: 3200.75,
      date: "2024-08-26",
      notes: "Excellent results from targeted ad campaigns",
      createdAt: "2024-08-26T09:15:00Z",
      updatedAt: "2024-08-26T09:15:00Z",
      status: "approved",
    },
    {
      id: "4",
      platform: "WhatsApp",
      salesCount: 12,
      revenue: 1200.0,
      date: "2024-08-25",
      notes: "Lower than usual, investigating potential issues",
      createdAt: "2024-08-25T11:30:00Z",
      updatedAt: "2024-08-25T13:20:00Z",
      status: "rejected",
    },
    {
      id: "5",
      platform: "Instagram",
      salesCount: 28,
      revenue: 2800.25,
      date: "2024-08-24",
      notes: "Great response from influencer collaboration",
      createdAt: "2024-08-24T16:45:00Z",
      updatedAt: "2024-08-24T16:45:00Z",
      status: "approved",
    },
    {
      id: "6",
      platform: "Facebook",
      salesCount: 15,
      revenue: 1500.0,
      date: "2024-08-23",
      notes: "",
      createdAt: "2024-08-23T12:00:00Z",
      updatedAt: "2024-08-23T12:00:00Z",
      status: "draft",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchReports = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReports(mockReports);
      setFilteredReports(mockReports);
      setLoading(false);
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    // Apply filters
    if (filters.platform) {
      filtered = filtered.filter(
        (report) => report.platform === filters.platform
      );
    }
    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status);
    }
    if (filters.search) {
      filtered = filtered.filter(
        (report) =>
          report.notes.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.platform.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "revenue":
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case "salesCount":
          aValue = a.salesCount;
          bValue = b.salesCount;
          break;
        case "platform":
          aValue = a.platform;
          bValue = b.platform;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
  }, [reports, filters, sortBy, sortOrder]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "submitted":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "draft":
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "WhatsApp":
        return "bg-green-100 text-green-800";
      case "Instagram":
        return "bg-pink-100 text-pink-800";
      case "Facebook":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateTotalStats = () => {
    return filteredReports.reduce(
      (acc, report) => {
        acc.totalSales += report.salesCount;
        acc.totalRevenue += report.revenue;
        return acc;
      },
      { totalSales: 0, totalRevenue: 0 }
    );
  };

  const stats = calculateTotalStats();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sales Reports
                </h1>
                <p className="text-gray-600">
                  Track and analyze your sales performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSales}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg. Sale Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {stats.totalSales > 0
                    ? (stats.totalRevenue / stats.totalSales).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={filters.platform}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, platform: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Platforms</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="revenue">Revenue</option>
                <option value="salesCount">Sales Count</option>
                <option value="platform">Platform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Reports ({filteredReports.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reports...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No reports found matching your criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("date")}
                    >
                      Date{" "}
                      {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("platform")}
                    >
                      Platform{" "}
                      {sortBy === "platform" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("salesCount")}
                    >
                      Sales{" "}
                      {sortBy === "salesCount" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("revenue")}
                    >
                      Revenue{" "}
                      {sortBy === "revenue" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlatformColor(
                            report.platform
                          )}`}
                        >
                          {report.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.salesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${report.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(report.status)}
                          <span
                            className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Report Details
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedReport.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <span
                      className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlatformColor(
                        selectedReport.platform
                      )}`}
                    >
                      {selectedReport.platform}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sales Count
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">
                      {selectedReport.salesCount}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Revenue
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">
                      ${selectedReport.revenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1 flex items-center">
                      {getStatusIcon(selectedReport.status)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status.charAt(0).toUpperCase() +
                          selectedReport.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created At
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {selectedReport.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                      {selectedReport.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
