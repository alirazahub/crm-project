"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Save,
  Upload,
  X,
  Eye,
  Star,
  Package,
  Tag,
  ImageIcon,
  Settings,
  Truck,
} from "lucide-react";

// Changed to PascalCase and proper export
export default function ProductForm({
  initialData = null,
  mode = "add",
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  subcategory: "",
  brand: "",
  tags: [],
  price: "",
  originalPrice: "",
  costPrice: "",
  discount: {
    percentage: "",
    amount: "",
    startDate: "",
    endDate: "",
    isActive: false,
  },
  stock: {
    quantity: "",
    lowStockThreshold: 10,
    trackInventory: true,
  },
  images: [],  
  status: "draft",
  isFeatured: false,
});


  const [activeTab, setActiveTab] = useState("basic");
  const [newTag, setNewTag] = useState("");
  

  // Initialize form with data when in update mode
  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData, mode]);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Food",
    "Toys",
    "Health",
  ];

  // This is the correct way to handle form submission inside the component
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form behavior (page reload)
    onSubmit(formData); // Calls the onSubmit prop with the current form data
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };


  const handleImageChange = (e) => {
  const files = Array.from(e.target.files); // convert FileList → Array
  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, ...files], // append new images
  }));
};

const removeImage = (index) => {
  setFormData((prev) => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));
};


  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing", icon: Tag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "media", label: "Images", icon: ImageIcon },
    // 
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {mode === "add" ? "Add New Product" : "Edit Product"}
              </h1>
              <p className="text-slate-600 mt-2">
                Create and manage your product catalog
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/display-products")}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                View Products
              </button>
              <button
                type="submit" // The button must have type="submit" to trigger the form's onSubmit event
                form="product-form"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {isLoading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <form
              id="product-form"
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              {/* Basic Information */}
              {activeTab === "basic" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Package className="text-indigo-600" />
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="Brief product description"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 resize-none"
                        placeholder="Detailed product description"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-indigo-900"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                          className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          placeholder="Add tag"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing */}
              {activeTab === "pricing" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Tag className="text-indigo-600" />
                    Pricing & Discounts
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Original Price
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cost Price
                      </label>
                      <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Discount Settings
                    </h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="discount.isActive"
                        checked={formData.discount.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm font-medium text-slate-700">
                        Enable Discount
                      </label>
                    </div>
                    {formData.discount.isActive && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Discount %
                          </label>
                          <input
                            type="number"
                            name="discount.percentage"
                            value={formData.discount.percentage}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                            placeholder="0"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Discount Amount
                          </label>
                          <input
                            type="number"
                            name="discount.amount"
                            value={formData.discount.amount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="discount.startDate"
                            value={formData.discount.startDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            name="discount.endDate"
                            value={formData.discount.endDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Inventory */}
              {activeTab === "inventory" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Package className="text-indigo-600" />
                    Inventory Management
                  </h2>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock.quantity"
                        value={formData.stock.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        name="stock.lowStockThreshold"
                        value={formData.stock.lowStockThreshold}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="10"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="stock.trackInventory"
                        checked={formData.stock.trackInventory}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm font-medium text-slate-700">
                        Track Inventory
                      </label>
                    </div>
                  </div>
                  
                  
                </div>
              )}

              {activeTab === "media" && (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
      <ImageIcon className="text-indigo-600" />
      Product Images
    </h2>

    {/* File Input */}
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50">
      <Upload className="mx-auto text-slate-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Upload Product Images
      </h3>
      <p className="text-slate-500 mb-4">
        Drag and drop or select multiple images
      </p>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="hidden"
        id="imageUpload"
      />
      <label
        htmlFor="imageUpload"
        className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 inline-block"
      >
        Choose Files
      </label>
    </div>

    {/* Preview Selected Images */}
    {formData.images.length > 0 && (
      <div className="mt-6 grid grid-cols-4 gap-4">
        {formData.images.map((file, index) => (
          <div
            key={index}
            className="relative border rounded-lg overflow-hidden group"
          >
            <img
              src={typeof file === "string" ? file : URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-32 object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    )}

    <div className="mt-6 text-sm text-slate-600">
      <p>• Recommended size: 1200x1200 pixels</p>
      <p>• Supported formats: JPG, PNG, WebP</p>
      <p>• Maximum file size: 5MB per image</p>
    </div>
  </div>
)}

  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
      <ImageIcon className="text-indigo-600" />
      Product Images
    </h2>

    {/* File Input */}
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50">
      <Upload className="mx-auto text-slate-400 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        Upload Product Images
      </h3>
      <p className="text-slate-500 mb-4">
        Drag and drop or select multiple images
      </p>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="hidden"
        id="imageUpload"
      />
      <label
        htmlFor="imageUpload"
        className="cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 inline-block"
      >
        Choose Files
      </label>
    </div>

    {/* Preview Selected Images */}
    {formData.images.length > 0 && (
      <div className="mt-6 grid grid-cols-4 gap-4">
        {formData.images.map((file, index) => (
          <div
            key={index}
            className="relative border rounded-lg overflow-hidden group"
          >
            <img
              src={typeof file === "string" ? file : URL.createObjectURL(file)}
              alt="preview"
              className="w-full h-32 object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    )}

    <div className="mt-6 text-sm text-slate-600">
      <p>• Recommended size: 1200x1200 pixels</p>
      <p>• Supported formats: JPG, PNG, WebP</p>
      <p>• Maximum file size: 5MB per image</p>
    </div>
  </div>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
