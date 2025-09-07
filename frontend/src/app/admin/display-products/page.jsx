//Enhanced products page with image viewer and smooth animations

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MetricCard from "@/components/MetricCard"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Star,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ImageIcon,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, deleteProduct } from "../../../store/slices/productSlice"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Loader from "@/components/loader"
export default function ProductsPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { products, loading, error } = useSelector((state) => state.product)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showFilters, setShowFilters] = useState(false)

  // Image viewer states
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [showImageViewer, setShowImageViewer] = useState(false)

  const categories = [
    "All Categories",
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

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Image viewer functions
  const openImageViewer = (product, imageIndex = 0) => {
    setSelectedProduct(product)
    setCurrentImageIndex(imageIndex)
    setSelectedImage(product.images[imageIndex])
    setImageZoom(1)
    setShowImageViewer(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeImageViewer = () => {
    setShowImageViewer(false)
    setSelectedImage(null)
    setSelectedProduct(null)
    setCurrentImageIndex(0)
    setImageZoom(1)
    document.body.style.overflow = "auto" // Restore scrolling
  }

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % selectedProduct.images.length
      setCurrentImageIndex(nextIndex)
      setSelectedImage(selectedProduct.images[nextIndex])
      setImageZoom(1)
    }
  }

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      const prevIndex = currentImageIndex === 0 ? selectedProduct.images.length - 1 : currentImageIndex - 1
      setCurrentImageIndex(prevIndex)
      setSelectedImage(selectedProduct.images[prevIndex])
      setImageZoom(1)
    }
  }

  const zoomIn = () => setImageZoom((prev) => Math.min(prev + 0.3, 3))
  const zoomOut = () => setImageZoom((prev) => Math.max(prev - 0.3, 0.5))

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId))
      if (deleteProduct.fulfilled.match(result)) {
        console.log("Product deleted successfully")
      } else {
        alert("Failed to delete product: " + result.payload)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product: " + error.message)
    }
  }

  const filteredProducts = products
    ?.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "" || selectedCategory === "All Categories" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || ""
      let bValue = b[sortBy] || ""

      if (sortBy === "price" || sortBy === "stock.quantity") {
        aValue = Number.parseFloat(aValue) || 0
        bValue = Number.parseFloat(bValue) || 0
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600/20 text-green-400 border-green-700"
      case "draft":
        return "bg-yellow-600/20 text-yellow-400 border-yellow-700"
      case "inactive":
        return "bg-red-600/20 text-red-400 border-red-700"
      case "archived":
        return "bg-slate-600/20 text-slate-400 border-slate-700"
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-700"
    }
  }

  // Enhanced Product Card Component
  const ProductCard = ({ product }) => (
    <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800/50 transition-all duration-300">
      <div className="relative overflow-hidden">
        <div
          className="h-32 bg-slate-800/50 cursor-pointer"
          onClick={() => product.images?.length > 0 && openImageViewer(product, 0)}
        >
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="text-white" size={20} />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="text-slate-500" size={32} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-100 text-xs truncate">{product.name}</h3>
            <p className="text-xs text-slate-400 truncate">{product.brand}</p>
          </div>
          {product.isFeatured && <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 ml-2"></div>}
        </div>

        <div className="mb-2">
          <span className="text-sm font-semibold text-cyan-400">${product.price}</span>
          {product.originalPrice > 0 && product.originalPrice > product.price && (
            <span className="text-xs text-slate-500 line-through ml-2">${product.originalPrice}</span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Stock:</span>
            {product.stock?.quantity > 10 ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-xs">{product.stock.quantity}</span>
              </div>
            ) : product.stock?.quantity > 0 ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-400 text-xs">{product.stock.quantity}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-400 text-xs">Out</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor(product.status).includes("green") ? "bg-green-400" : getStatusColor(product.status).includes("yellow") ? "bg-yellow-400" : getStatusColor(product.status).includes("red") ? "bg-red-400" : "bg-slate-400"}`}
            ></div>
            <span className="text-xs text-slate-300">{product.status}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/edit-product/${product._id}`)}
            className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-green-400 px-2 py-1 rounded-lg text-xs transition-all duration-300 flex items-center justify-center gap-1"
          >
            <Edit size={12} />
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(product._id)}
            className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-red-400 px-2 py-1 rounded-lg text-xs transition-all duration-300 flex items-center justify-center gap-1"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  const ProductTable = ({ products }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-slate-800/50 border-b border-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {products.map((product) => (
            <tr key={product._id} className="text-xs text-slate-300 hover:bg-slate-800/30 transition-all duration-300">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    {product.images && product.images.length > 0 ? (
                      <div className="relative cursor-pointer" onClick={() => openImageViewer(product, 0)}>
                        <img
                          className="h-8 w-8 rounded-full object-cover border border-slate-700/50"
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                        />
                      </div>
                    ) : (
                      <ImageIcon
                        size={20}
                        className="h-8 w-8 text-slate-500 bg-slate-800 rounded-full p-1 border border-slate-700/50"
                      />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-xs font-medium text-slate-100">{product.name}</div>
                    <div className="text-xs text-slate-400">{product.brand}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-xs text-cyan-400 font-medium">${product.price}</div>
                {product.originalPrice > 0 && product.originalPrice > product.price && (
                  <div className="text-xs text-slate-500 line-through">${product.originalPrice}</div>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {product.stock?.quantity > 10 ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-xs">{product.stock.quantity}</span>
                    </>
                  ) : product.stock?.quantity > 0 ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-400 text-xs">{product.stock.quantity}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-400 text-xs">Out</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(product.status).includes("green") ? "bg-green-400" : getStatusColor(product.status).includes("yellow") ? "bg-yellow-400" : getStatusColor(product.status).includes("red") ? "bg-red-400" : "bg-slate-400"}`}
                  ></div>
                  <span className="text-xs text-slate-300">{product.status}</span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => router.push(`/admin/edit-product/${product._id}`)}
                    className="text-green-400 hover:text-green-300 transition-all duration-300"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-400 hover:text-red-300 transition-all duration-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Image Viewer Modal Component
  const ImageViewerModal = () => {
    if (!showImageViewer || !selectedImage || !selectedProduct) return null

    return (
      <div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fadeIn"
        onClick={closeImageViewer}
      >
        <div className="relative max-w-7xl max-h-full p-4 animate-slideInScale" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
              <p className="text-sm text-slate-300">
                {currentImageIndex + 1} of {selectedProduct.images.length}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={zoomOut}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-300"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={zoomIn}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-300"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={closeImageViewer}
                className="bg-black/50 backdrop-blur-sm hover:bg-red-600/50 text-white p-2 rounded-lg transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation arrows */}
          {selectedProduct.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="flex items-center justify-center min-h-[70vh] overflow-hidden">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt={selectedProduct.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
              style={{ transform: `scale(${imageZoom})` }}
            />
          </div>

          {/* Thumbnail strip */}
          {selectedProduct.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index)
                    setSelectedImage(image)
                    setImageZoom(1)
                  }}
                  className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    index === currentImageIndex
                      ? "border-cyan-400 shadow-lg scale-110"
                      : "border-slate-600 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="text-lg text-slate-300 mt-4">Loading products...</p>
        </div>
      </div>
    )
  }

  // Calculate values for Metric Cards
  const totalProducts = products?.length || 0
  const activeProducts = products?.filter((p) => p.status === "active").length || 0
  const featuredProducts = products?.filter((p) => p.isFeatured).length || 0
  const totalValue = products?.reduce((sum, p) => sum + (Number.parseFloat(p.price) || 0), 0).toFixed(2) || "0.00"

  return (
    <>
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        
        @keyframes slideInScale {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
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
        
        .animate-slideInScale {
          animation: slideInScale 0.4s ease-out;
        }
      `}</style>

      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden mb-6">
            <CardHeader className="border-b border-slate-700/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-100 flex items-center text-lg">
                  <ShoppingBag className="mr-2 h-5 w-5 text-cyan-500" />
                  Product Catalog
                </CardTitle>
                <Button
                  onClick={() => router.push("/admin/createProducts")}
                  className="bg-slate-800/50 hover:bg-slate-700/50 text-cyan-400 border border-cyan-500/50 text-xs rounded-lg px-3 py-2 flex items-center gap-2 transition-all duration-300 hover:scale-105 transform"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                <MetricCard
                  title="Total Products"
                  value={totalProducts}
                  icon={Package}
                  trend="up"
                  color="cyan"
                  detail="Data refreshed"
                  unit=""
                />
              </div>
              <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                <MetricCard
                  title="Active Products"
                  value={activeProducts}
                  icon={TrendingUp}
                  trend="up"
                  color="green"
                  detail="Last 30 days"
                  unit=""
                />
              </div>
              <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
                <MetricCard
                  title="Featured Products"
                  value={featuredProducts}
                  icon={Star}
                  trend="stable"
                  color="purple"
                  detail="Always visible"
                  unit=""
                />
              </div>
              <div className="animate-fadeInUp" style={{ animationDelay: "400ms" }}>
                <MetricCard
                  title="Total Value"
                  value={totalValue}
                  icon={DollarSign}
                  trend="up"
                  color="blue"
                  detail="Estimated market value"
                  unit="$"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500 text-xs"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border border-slate-700/50 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs font-medium ${
                  showFilters
                    ? "bg-cyan-600/20 text-cyan-400 border-cyan-500/50"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Filter size={16} />
                Filters
                <ChevronDown
                  size={14}
                  className={`transform transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              <div className="flex bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 transition-all duration-300 text-xs ${
                    viewMode === "grid" ? "bg-cyan-600/20 text-cyan-400" : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 transition-all duration-300 text-xs ${
                    viewMode === "list" ? "bg-cyan-600/20 text-cyan-400" : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 transition-all duration-300 text-xs ${
                    viewMode === "table" ? "bg-cyan-600/20 text-cyan-400" : "text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <List size={16} className="rotate-90" />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 mt-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                        {cat}
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
                    <option value="name" className="bg-slate-900 text-slate-100">
                      Name
                    </option>
                    <option value="price" className="bg-slate-900 text-slate-100">
                      Price
                    </option>
                    <option value="category" className="bg-slate-900 text-slate-100">
                      Category
                    </option>
                    <option value="status" className="bg-slate-900 text-slate-100">
                      Status
                    </option>
                    <option value="createdAt" className="bg-slate-900 text-slate-100">
                      Date Created
                    </option>
                    <option value="stock.quantity" className="bg-slate-900 text-slate-100">
                      Stock Quantity
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

          {filteredProducts && filteredProducts.length > 0 ? (
            <div>
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div key={product._id} style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-4">
                  {filteredProducts.map((product, index) => (
                    <div key={product._id} style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "table" && <ProductTable products={filteredProducts} />}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
              <Package className="mx-auto text-slate-500 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No products found</h3>
              <p className="text-slate-400 mb-4 text-xs">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first product"}
              </p>
              <button
                onClick={() => router.push("/admin/createProduct")}
                className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/50 rounded-lg text-xs transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Add Your First Product
              </button>
            </div>
          )}
        </div>

        {/* Image Viewer Modal */}
        <ImageViewerModal />
      </div>
    </>
  )
}
