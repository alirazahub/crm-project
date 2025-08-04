"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Save, Upload, X, Eye, Star, Package, Tag, ImageIcon, Settings, Truck } from "lucide-react"

export default function AddProductPage() {
  const router = useRouter()

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
    variants: [],
    images: [],
    seo: {
      title: "",
      metaDescription: "",
      keywords: [],
      slug: "",
    },
    specifications: [],
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "cm",
    },
    weight: {
      value: "",
      unit: "kg",
    },
    status: "draft",
    isVisible: true,
    isFeatured: false,
    shipping: {
      freeShipping: false,
      shippingCost: "",
    },
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [newTag, setNewTag] = useState("")
  const [newSpec, setNewSpec] = useState({ name: "", value: "" })
  const [newVariant, setNewVariant] = useState({ name: "", value: "", price: "", stock: "", sku: "" })

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
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
    console.log("Sending product data:", formData)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Product saved successfully:", data)
        alert("Product saved successfully!")
        router.push("/products")
      } else {
        console.error("Failed to save product:", data.message || data.errors)
        alert(`Failed to save product: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
      alert("An unexpected network error occurred.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addSpecification = () => {
    if (newSpec.name.trim() && newSpec.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpec }],
      }))
      setNewSpec({ name: "", value: "" })
    }
  }

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const addVariant = () => {
    if (newVariant.name.trim() && newVariant.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }],
      }))
      setNewVariant({ name: "", value: "", price: "", stock: "", sku: "" })
    }
  }

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing", icon: Tag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "media", label: "Images", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Eye },
    { id: "advanced", label: "Advanced", icon: Settings },
    { id: "shipping", label: "Shipping", icon: Truck },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-slate-600 mt-2">Create and manage your product catalog</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                View Products
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Save size={20} />
                Save Product
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
                  const Icon = tab.icon
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
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              {activeTab === "basic" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Package className="text-indigo-600" />
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                          >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
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
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Price *</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Original Price</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Cost Price</label>
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
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Discount Settings</h3>
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="discount.isActive"
                        checked={formData.discount.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm font-medium text-slate-700">Enable Discount</label>
                    </div>
                    {formData.discount.isActive && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount %</label>
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
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Discount Amount</label>
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
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            name="discount.startDate"
                            value={formData.discount.startDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity *</label>
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
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Low Stock Threshold</label>
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
                      <label className="ml-2 text-sm font-medium text-slate-700">Track Inventory</label>
                    </div>
                  </div>
                  {/* Product Variants */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Variants</h3>
                    {formData.variants.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formData.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200"
                          >
                            <span className="font-medium text-slate-700">
                              {variant.name}: {variant.value}
                            </span>
                            <span className="text-slate-600">${variant.price}</span>
                            <span className="text-slate-600">Stock: {variant.stock}</span>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="Variant name (e.g., Size)"
                        value={newVariant.name}
                        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Large)"
                        value={newVariant.value}
                        onChange={(e) => setNewVariant({ ...newVariant, value: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={newVariant.price}
                        onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        step="0.01"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newVariant.stock}
                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      />
                      <button
                        type="button"
                        onClick={addVariant}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Media/Images */}
              {activeTab === "media" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <ImageIcon className="text-indigo-600" />
                    Product Images
                  </h2>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50">
                    <Upload className="mx-auto text-slate-400 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Product Images</h3>
                    <p className="text-slate-500 mb-4">Drag and drop your images here, or click to browse</p>
                    <button
                      type="button"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Choose Files
                    </button>
                  </div>
                  <div className="mt-6 text-sm text-slate-600">
                    <p>• Recommended size: 1200x1200 pixels</p>
                    <p>• Supported formats: JPG, PNG, WebP</p>
                    <p>• Maximum file size: 5MB per image</p>
                  </div>
                </div>
              )}

              {/* SEO */}
              {activeTab === "seo" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Eye className="text-indigo-600" />
                    SEO & Visibility
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">SEO Title</label>
                      <input
                        type="text"
                        name="seo.title"
                        value={formData.seo.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="SEO optimized title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Description</label>
                      <textarea
                        name="seo.metaDescription"
                        value={formData.seo.metaDescription}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 resize-none"
                        placeholder="Meta description for search engines"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">URL Slug</label>
                      <input
                        type="text"
                        name="seo.slug"
                        value={formData.seo.slug}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        placeholder="product-url-slug"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isVisible"
                          checked={formData.isVisible}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm font-medium text-slate-700">Visible to customers</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label className="ml-2 text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Star size={16} className="text-yellow-500" />
                          Featured product
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced */}
              {activeTab === "advanced" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Settings className="text-indigo-600" />
                    Advanced Settings
                  </h2>
                  {/* Specifications */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Specifications</h3>
                    {formData.specifications.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {formData.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200"
                          >
                            <span className="font-medium text-slate-700">{spec.name}:</span>
                            <span className="text-slate-600">{spec.value}</span>
                            <button
                              type="button"
                              onClick={() => removeSpecification(index)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Specification name"
                        value={newSpec.name}
                        onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={newSpec.value}
                        onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      />
                      <button
                        type="button"
                        onClick={addSpecification}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                  {/* Dimensions & Weight */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensions</h3>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input
                          type="number"
                          name="dimensions.length"
                          value={formData.dimensions.length}
                          onChange={handleInputChange}
                          placeholder="Length"
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          step="0.01"
                        />
                        <input
                          type="number"
                          name="dimensions.width"
                          value={formData.dimensions.width}
                          onChange={handleInputChange}
                          placeholder="Width"
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          step="0.01"
                        />
                        <input
                          type="number"
                          name="dimensions.height"
                          value={formData.dimensions.height}
                          onChange={handleInputChange}
                          placeholder="Height"
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          step="0.01"
                        />
                      </div>
                      <select
                        name="dimensions.unit"
                        value={formData.dimensions.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                      >
                        <option value="cm">Centimeters</option>
                        <option value="inch">Inches</option>
                        <option value="m">Meters</option>
                      </select>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Weight</h3>
                      <div className="space-y-3">
                        <input
                          type="number"
                          name="weight.value"
                          value={formData.weight.value}
                          onChange={handleInputChange}
                          placeholder="Weight"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          step="0.01"
                        />
                        <select
                          name="weight.unit"
                          value={formData.weight.unit}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                        >
                          <option value="kg">Kilograms</option>
                          <option value="g">Grams</option>
                          <option value="lb">Pounds</option>
                          <option value="oz">Ounces</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {activeTab === "shipping" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Truck className="text-indigo-600" />
                    Shipping Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="shipping.freeShipping"
                        checked={formData.shipping.freeShipping}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm font-medium text-slate-700">Free Shipping</label>
                    </div>
                    {!formData.shipping.freeShipping && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Shipping Cost</label>
                        <input
                          type="number"
                          name="shipping.shippingCost"
                          value={formData.shipping.shippingCost}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                    )}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Shipping Information</h3>
                      <div className="text-sm text-slate-600 space-y-2">
                        <p>• Products will be processed within 1-2 business days</p>
                        <p>• Standard shipping takes 3-7 business days</p>
                        <p>• Express shipping available at checkout</p>
                        <p>• Free shipping on orders over $50</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
