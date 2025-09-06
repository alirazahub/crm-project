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
  Truck,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    "Hoodies",
    "Tshirts",
    "Jackets",
    "Leader Jackets",
    "Denim Jackets",
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
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
    { id: "inventory", label: "Inventory", icon: Truck },
    { id: "media", label: "Images", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="text-cyan-400 h-6 w-6" />
                <div>
                  <CardTitle className="text-xl font-bold text-slate-100">
                    {mode === "add" ? "Add New Product" : "Edit Product"}
                  </CardTitle>
                  <p className="text-slate-400 mt-1 text-xs">
                    Create and manage your product catalog
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/admin/display-products")}
                  className="bg-slate-800/50 text-cyan-400 border border-cyan-500/50 text-xs rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-slate-800/70 transition-all duration-200"
                >
                  <Eye className="h-4 w-4" />
                  View Products
                </Button>
                <Button
                  type="submit"
                  form="product-form"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs rounded-lg px-3 py-2 flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant="ghost"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          activeTab === tab.id
                            ? "text-cyan-500"
                            : "text-slate-500"
                        }
                      />
                      {tab.label}
                      {activeTab === tab.id && (
                        <ChevronRight className="ml-auto h-3 w-3 text-cyan-500" />
                      )}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <form
              id="product-form"
              onSubmit={handleFormSubmit}
              className="space-y-6"
            >
              {/* Basic Information */}
              {activeTab === "basic" && (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Package className="text-cyan-500 h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 backdrop-blur-sm text-slate-100 text-xs hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzY0NzQ4QiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-right bg-[center_right_0.75rem] pr-10"
                        required
                      >
                        <option
                          value=""
                          className="bg-slate-800 text-slate-400"
                        >
                          Select Category
                        </option>
                        {categories.map((cat) => (
                          <option
                            key={cat}
                            value={cat}
                            className="bg-slate-800 text-slate-100 hover:bg-cyan-500"
                          >
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                        placeholder="Enter brand name"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                        placeholder="Brief product description"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500 resize-none"
                        placeholder="Detailed product description"
                        required
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs border border-cyan-500/20"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-cyan-300 transition-colors"
                            >
                              <X size={10} />
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
                          className="flex-1 px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="Add tag"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg px-3 py-2"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "pricing" && (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Tag className="text-cyan-500 h-5 w-5" />
                      Pricing & Discounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Original Price
                        </label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Cost Price
                        </label>
                        <input
                          type="number"
                          name="costPrice"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <h3 className="text-sm font-medium text-slate-100 mb-3 flex items-center gap-2">
                        <Star className="text-cyan-400 h-4 w-4" />
                        Discount Settings
                      </h3>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          name="discount.isActive"
                          checked={formData.discount.isActive}
                          onChange={handleInputChange}
                          className="w-3 h-3 text-cyan-600 rounded focus:ring-cyan-500 bg-slate-800 border-slate-700"
                        />
                        <label className="ml-2 text-xs text-slate-300">
                          Enable Discount
                        </label>
                      </div>
                      {formData.discount.isActive && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Discount %
                            </label>
                            <input
                              type="number"
                              name="discount.percentage"
                              value={formData.discount.percentage}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Discount Amount
                            </label>
                            <input
                              type="number"
                              name="discount.amount"
                              value={formData.discount.amount}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              name="discount.startDate"
                              value={formData.discount.startDate}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              name="discount.endDate"
                              value={formData.discount.endDate}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "inventory" && (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <Truck className="text-cyan-500 h-5 w-5" />
                      Inventory Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="stock.quantity"
                          value={formData.stock.quantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          name="stock.lowStockThreshold"
                          value={formData.stock.lowStockThreshold}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-800/50 text-slate-100 text-xs placeholder-slate-500"
                          placeholder="10"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="stock.trackInventory"
                        checked={formData.stock.trackInventory}
                        onChange={handleInputChange}
                        className="w-3 h-3 text-cyan-600 rounded focus:ring-cyan-500 bg-slate-800 border-slate-700"
                      />
                      <label className="ml-2 text-xs text-slate-300">
                        Track Inventory
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "media" && (
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <ImageIcon className="text-cyan-500 h-5 w-5" />
                      Product Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-all duration-200 bg-slate-800/20">
                      <Upload
                        className="mx-auto text-slate-500 mb-3"
                        size={32}
                      />
                      <h3 className="text-sm font-medium text-slate-100 mb-2">
                        Upload Product Images
                      </h3>
                      <p className="text-slate-400 mb-3 text-xs">
                        Drag and drop or select multiple images
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                        accept="image/jpeg,image/png,image/webp"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="cursor-pointer px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200 inline-block text-xs font-medium"
                      >
                        Choose Files
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {formData.images.map((file, index) => (
                          <div
                            key={index}
                            className="relative border border-slate-700/50 rounded-lg overflow-hidden group"
                          >
                            <img
                              src={
                                typeof file === "string"
                                  ? file
                                  : URL.createObjectURL(file)
                              }
                              alt="preview"
                              className="w-full h-24 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 text-xs text-slate-500 space-y-1">
                      <p>• Recommended size: 1200x1200 pixels</p>
                      <p>• Supported formats: JPG, PNG, WebP</p>
                      <p>• Maximum file size: 5MB per image</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
