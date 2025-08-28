"use client";
import React, { useState } from "react";
import {
  Save,
  Send,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function SalesReportForm () {
  const [formData, setFormData] = useState({
    platform: "",
    salesCount: "",
    revenue: "",
    date: new Date().toISOString().split("T")[0], // Today's date as default
    notes: "",
    status: "draft",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms = [
    {
      value: "WhatsApp",
      label: "WhatsApp",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "Instagram",
      label: "Instagram",
      color: "bg-pink-100 text-pink-800",
    },
    {
      value: "Facebook",
      label: "Facebook",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.platform) {
      newErrors.platform = "Platform is required";
    }

    if (!formData.salesCount) {
      newErrors.salesCount = "Sales count is required";
    } else if (parseInt(formData.salesCount) < 0) {
      newErrors.salesCount = "Sales count cannot be negative";
    }

    if (!formData.revenue) {
      newErrors.revenue = "Revenue is required";
    } else if (parseFloat(formData.revenue) < 0) {
      newErrors.revenue = "Revenue cannot be negative";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      const submitData = {
        ...formData,
        status,
        salesCount: parseInt(formData.salesCount),
        revenue: parseFloat(formData.revenue),
      };

      console.log("Submitting sales report:", submitData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `Sales report ${
          status === "draft" ? "saved as draft" : "submitted for approval"
        } successfully!`
      );

      // Reset form after successful submission (except for draft)
      if (status !== "draft") {
        setFormData({
          platform: "",
          salesCount: "",
          revenue: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          status: "draft",
        });
      }
    } catch (error) {
      alert("Error submitting form. Please try again.");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Sales Report</h1>
                <p className="text-blue-100">
                  Fill out your daily sales performance
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Platform <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {platforms.map((platform) => (
                  <label
                    key={platform.value}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.platform === platform.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value={platform.value}
                      checked={formData.platform === platform.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${platform.color} mb-1`}
                      >
                        {platform.label}
                      </span>
                    </div>
                    {formData.platform === platform.value && (
                      <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {errors.platform && (
                <p className="mt-2 text-sm text-red-600">{errors.platform}</p>
              )}
            </div>

            {/* Sales Count and Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sales Count <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="salesCount"
                    value={formData.salesCount}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.salesCount ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter number of sales"
                  />
                </div>
                {errors.salesCount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.salesCount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Revenue <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.revenue ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter revenue amount"
                  />
                </div>
                {errors.revenue && (
                  <p className="mt-1 text-sm text-red-600">{errors.revenue}</p>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Add any additional notes about the sales performance..."
              />
            </div>

            {/* Summary Card */}
            {(formData.salesCount || formData.revenue) && (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sales Count:</span>
                    <span className="font-semibold ml-2">
                      {formData.salesCount || "0"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold ml-2">
                      ${formData.revenue || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit("submitted")}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
