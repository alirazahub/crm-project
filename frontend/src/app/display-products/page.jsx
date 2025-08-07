"use client"

import { useState, useEffect } from "react"
import { Search, Star, Edit, Eye, Heart, Package, Truck, Grid, List, Trash2 } from "lucide-react"
import Link from "next/link"

export default function ProductsDisplay() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [deleteLoading, setDeleteLoading] = useState(null)

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if API URL is configured
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL environment variable is not configured")
        }

        console.log("Fetching from:", `${apiUrl}/api/product/`)

        const response = await fetch(`${apiUrl}/api/product/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text()
          throw new Error(`Expected JSON response but got: ${contentType}. Response: ${text.substring(0, 200)}...`)
        }

        const data = await response.json()
        console.log("Fetched products:", data)

        // Ensure data is an array (your API returns array directly)
        const productsArray = Array.isArray(data) ? data : []

        if (productsArray.length === 0) {
          console.warn("No products found in the response")
        }

        setProducts(productsArray)
        setFilteredProducts(productsArray)
      } catch (err) {
        console.error("Error fetching products:", err.message)
        setError(err.message)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "" || product.category === selectedCategory

      return matchesSearch && matchesCategory && product.isVisible
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.price) - Number.parseFloat(b.price)
        case "price-high":
          return Number.parseFloat(b.price) - Number.parseFloat(a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const calculateDiscountedPrice = (product) => {
    if (product.discount?.isActive) {
      const price = Number.parseFloat(product.price)
      if (product.discount.percentage) {
        return price - (price * Number.parseFloat(product.discount.percentage)) / 100
      }
      if (product.discount.amount) {
        return price - Number.parseFloat(product.discount.amount)
      }
    }
    return Number.parseFloat(product.price)
  }


  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      setDeleteLoading(productId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Remove the product from the local state
        setProducts(products.filter((product) => product._id !== productId))
        alert("Product deleted successfully!")
      } else {
        const data = await response.json()
        alert(`Failed to delete product: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("An error occurred while deleting the product.")
    } finally {
      setDeleteLoading(null)
    }
  }

  const ProductCard = ({ product }) => {
    const discountedPrice = calculateDiscountedPrice(product)
    const hasDiscount = product.discount?.isActive && discountedPrice < Number.parseFloat(product.price)

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        {/* Product Image */}
        <div className="relative h-64 bg-gradient-to-br from-slate-100 to-blue-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="text-slate-400" size={64} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} />
                Featured
              </span>
            )}
            {hasDiscount && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {product.discount.percentage
                  ? `${product.discount.percentage}% OFF`
                  : `$${product.discount.amount} OFF`}
              </span>
            )}
            {product.shipping?.freeShipping && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Truck size={12} />
                Free Ship
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300">
              <Eye size={16} className="text-slate-600" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300">
              <Heart size={16} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-sm text-slate-500 line-through">
                    ${Number.parseFloat(product.price).toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-slate-800">${discountedPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{product.name}</h3>

          {product.brand && <p className="text-sm text-slate-600 mb-2">by {product.brand}</p>}

          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{product.shortDescription || product.description}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-xs text-slate-500">+{product.tags.length - 3} more</span>
              )}
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock?.quantity > product.stock?.lowStockThreshold
                    ? "bg-green-500"
                    : product.stock?.quantity > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-slate-600">
                {product.stock?.quantity > 0 ? `${product.stock.quantity} in stock` : "Out of stock"}
              </span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-slate-500">{product.variants.length} variants</span>
            )}
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex gap-2">

            <Link href={`/${product._id}`} prefetch={false}>
            <button

              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              Edit
            </button>
            </Link>
            
            <button
              onClick={() => handleDelete(product._id)}
              disabled={deleteLoading === product._id}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading === product._id ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Trash2 size={20} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  const ProductListItem = ({ product }) => {
    const discountedPrice = calculateDiscountedPrice(product)
    const hasDiscount = product.discount?.isActive && discountedPrice < Number.parseFloat(product.price)

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 flex gap-6 hover:shadow-2xl transition-all duration-300">
        {/* Product Image */}
        <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl overflow-hidden flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="text-slate-400" size={32} />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <h3 className="text-xl font-bold text-slate-800 mt-2">{product.name}</h3>
              {product.brand && <p className="text-sm text-slate-600">by {product.brand}</p>}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="text-lg text-slate-500 line-through">
                    ${Number.parseFloat(product.price).toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-slate-800">${discountedPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    product.stock?.quantity > product.stock?.lowStockThreshold
                      ? "bg-green-500"
                      : product.stock?.quantity > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-slate-600">
                  {product.stock?.quantity > 0 ? `${product.stock.quantity} in stock` : "Out of stock"}
                </span>
              </div>

              {product.shipping?.freeShipping && (
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <Truck size={12} />
                  Free Shipping
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product._id)}
                className="bg-gradient-to-r  from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                disabled={deleteLoading === product._id}
                className="bg-gradient-to-r from-red-600 to-red-700  hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading === product._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Failed to Load Products</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="text-sm text-red-600 space-y-2">
              <p>• Make sure your backend server is running</p>
              <p>• Check if NEXT_PUBLIC_API_URL is set correctly</p>
              <p>• Verify your API endpoint: {process.env.NEXT_PUBLIC_API_URL}/product</p>
              <p>• Check browser console for more details</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Our Products
              </h1>
              <p className="text-slate-600 mt-2">
                Discover our amazing collection of {filteredProducts.length} products
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "grid" ? "bg-white shadow-md text-indigo-600" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === "list" ? "bg-white shadow-md text-indigo-600" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-indigo-50 rounded-xl px-4 py-3">
              <span className="text-indigo-700 font-medium">{filteredProducts.length} Products Found</span>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <Package className="mx-auto text-slate-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Products Found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"
            }
          >
            {filteredProducts.map((product) => (
              <div key={product._id || product.id}>
                {viewMode === "grid" ? <ProductCard product={product} /> : <ProductListItem product={product} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
