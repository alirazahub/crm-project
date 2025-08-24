"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import DisplayImg from "@/components/view-images";
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
  Tag,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  X,
  ImageIcon,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
} from "../../../store/slices/productSlice";

export default function ProductsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
  ];
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await dispatch(deleteProduct(productId));
      if (deleteProduct.fulfilled.match(result)) {
        console.log("Product deleted successfully");
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete product: " + result.payload);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };

  const filteredProducts = products
    ?.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" ||
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";

      if (sortBy === "price") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <DisplayImg imgs={product.images} />
        ) : (
          <ImageIcon size={48} className="text-slate-400" />
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              product.status
            )}`}
          >
            {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600">{product.brand}</p>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {product.shortDescription || product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-indigo-600">
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-slate-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Category & Stock */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg">
            {product.category}
          </span>
          <span className="text-slate-600">
            Stock: {product.stock?.quantity || 0}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/products/${product._id}`)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
          <button
            onClick={() => router.push(`/admin/edit-product/${product._id}`)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => setDeleteConfirm(product._id)}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductRow = ({ product }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <ImageIcon size={24} className="text-slate-400" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-slate-600 mb-2">{product.brand}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {product.category}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status?.charAt(0).toUpperCase() +
                    product.status?.slice(1)}
                </span>
                {product.isFeatured && (
                  <Star className="text-yellow-500 fill-yellow-500" size={16} />
                )}
              </div>
            </div>

            {/* Price & Stock */}
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                ${product.price}
              </div>
              <div className="text-sm text-slate-600">
                Stock: {product.stock?.quantity || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => router.push(`/products/${product._id}`)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/edit-product/${product._id}`)}
            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeleteConfirm(product._id)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Product Catalog
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your product inventory and catalog
              </p>
            </div>
            <button
              onClick={() => router.push("/adminProducts")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Products</p>
                  <p className="text-2xl font-bold">{products?.length || 0}</p>
                </div>
                <Package className="text-blue-200" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Active Products</p>
                  <p className="text-2xl font-bold">
                    {products?.filter((p) => p.status === "active").length || 0}
                  </p>
                </div>
                <TrendingUp className="text-emerald-200" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Featured</p>
                  <p className="text-2xl font-bold">
                    {products?.filter((p) => p.isFeatured).length || 0}
                  </p>
                </div>
                <Star className="text-yellow-200" size={32} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Value</p>
                  <p className="text-2xl font-bold">
                    $
                    {products
                      ?.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
                      .toFixed(2) || "0.00"}
                  </p>
                </div>
                <DollarSign className="text-purple-200" size={32} />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border border-slate-200 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                showFilters
                  ? "bg-indigo-600 text-white"
                  : "bg-white/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Filter size={20} />
              Filters
            </button>

            <div className="flex bg-white/50 rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="category">Category</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Date Created</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Display */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) =>
              viewMode === "grid" ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <ProductRow key={product._id} product={product} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="mx-auto text-slate-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filters"
                : "Start by adding your first product"}
            </p>
            <button
              onClick={() => router.push("/add-product")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add Your First Product
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Delete Product
                </h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(deleteConfirm)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
