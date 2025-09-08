"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchFilteredProducts } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Grid,
  List,
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  X,
} from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { from } from "rxjs";

export default function FilterPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const productsState = useSelector((state) => state.product);
  const { filteredProducts, loading, error, pagination, filterOptions } =
    productsState || {
      filteredProducts: [],
      loading: false,
      error: null,
      pagination: null,
      filterOptions: { categories: [], brands: [], tags: [] },
    };

  // Get active filters for display
  const activeFilters = [];
  if (selectedCategory !== "all")
    activeFilters.push({ type: "category", value: selectedCategory });
  if (selectedBrand !== "all")
    activeFilters.push({ type: "brand", value: selectedBrand });
  if (priceRange[0] > 0 || priceRange[1] < 10000) {
    activeFilters.push({
      type: "price",
      value: `$${priceRange[0]} - $${priceRange[1]}`,
    });
  }

  const clearFilter = (filterType) => {
    if (filterType === "category") setSelectedCategory("all");
    if (filterType === "brand") setSelectedBrand("all");
    if (filterType === "price") setPriceRange([0, 10000]);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 10000]);
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  useEffect(() => {
    const filters = {
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      brand: selectedBrand !== "all" ? selectedBrand : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: 12,
    };

    // Add search term if provided
    if (searchTerm.trim()) {
      // For search, we'll filter on frontend since backend doesn't have search endpoint
      filters.searchTerm = searchTerm.trim();
    }

    console.log(
      "[v0] Dispatching fetchFilteredProducts with filters:",
      filters
    );

    dispatch(fetchFilteredProducts(filters))
      .then((result) => {
        console.log("[v0] fetchFilteredProducts SUCCESS:", result);
      })
      .catch((error) => {
        console.log("[v0] fetchFilteredProducts ERROR:", error);
        alert("Error fetching products: " + error.message);
      });
  }, [
    dispatch,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  useEffect(() => {
    console.log("[v0] Component mounted, fetching initial products...");
    // Fetch all products initially to get filter options
    dispatch(fetchFilteredProducts({ limit: 12, page: 1 }))
      .then((result) => {
        console.log("[v0] Initial fetch SUCCESS:", result);
      })
      .catch((error) => {
        console.log("[v0] Initial fetch ERROR:", error);
        alert("Error loading initial products: " + error.message);
      });
  }, [dispatch]);

  const searchFilteredProducts = searchTerm.trim()
    ? filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.shortDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    : filteredProducts;

  const handleAddToCart = (product) => {
    if (!user) {
      router.push("/login");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        // name: product.name,
        // price: product.price,
        // image: product.images?.[0] || "/placeholder.svg",
        quantity: 1,
      })
    );
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order || "desc");
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const maxPrice = Math.max(
    10000,
    ...filteredProducts.map((p) => p.price || 0)
  );

  const handleProductClick = (productId) => {
    router.push(`/customer/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-medium">
            Error loading products: {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white hover:bg-gray-700 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="text-sm text-gray-500">
          <span className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200">
            Home
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200">
            Shop
          </span>
          <span className="mx-2">{">"}</span>
          <span className="text-gray-800">All Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2 tracking-tight">
              All Products
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Showing 1-{Math.min(searchFilteredProducts.length, 12)} of{" "}
              {searchFilteredProducts.length} results
              {pagination &&
                ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center bg-gray-50 rounded-xl p-1 ">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border-2 border-black rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black shadow-sm transition-all duration-200"
            >
              <option value="createdAt-desc">Latest</option>
              <option value="createdAt-asc">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-2 border-black text-black hover:text-white rounded-xl transition-all duration-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-all duration-200"
              >
                <span>{filter.value}</span>
                <button
                  onClick={() => clearFilter(filter.type)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-72 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className=" rounded-2xl p-6 sticky top-4 mb-7 shadow-md shadow-gray-600">
              <div className="flex items-center justify-between mb-6 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* 🔍 Search */}
                <div className="p-4 border-2 rounded-xl bg-white">
                  <label className="block text-sm font-medium text-gray-800 mb-3">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl text-sm border-2 border-gray-200 focus:outline-none focus:border-black shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>

                {/* 📂 Category */}
                <div className="p-4 border-2 rounded-xl bg-white">
                  <label className="block text-sm font-semibold text-gray-800 mb-4">
                    Category
                  </label>
                  <div className="space-y-3">
                    {["all", ...(filterOptions.categories || [])].map(
                      (category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                              setCurrentPage(1);
                            }}
                            className="w-4 h-4 border-2 border-black rounded-full checked:bg-black checked:border-black focus:ring-2 focus:ring-black focus:outline-none"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200 capitalize">
                            {category === "all" ? "All Categories" : category}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* 🏷️ Brand */}
                <div className="p-4 border-2 rounded-xl bg-white">
                  <label className="block text-sm font-semibold text-gray-800 mb-4">
                    Brand
                  </label>
                  <div className="space-y-3">
                    {["all", ...(filterOptions.brands || [])].map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={selectedBrand === brand}
                          onChange={(e) => {
                            setSelectedBrand(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 border-2 border-black rounded-full checked:bg-black checked:border-black focus:ring-2 focus:ring-black focus:outline-none"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200 capitalize">
                          {brand === "all" ? "All Brands" : brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 border-2  rounded-xl bg-white">
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Price Range: ${priceRange[0]}.00 - ${priceRange[1]}.00
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value);
                    setCurrentPage(1);
                  }}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="mt-4"
                />
              </div>

              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full border-2 text-gray-500 hover:bg-black hover:text-white rounded-xl py-3 font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md bg-transparent"
              >
                Clear All Filters
              </Button>
            </div>
          </div>

          <div className="flex-1">
            {searchFilteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4 leading-relaxed">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5 bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {searchFilteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <CardContent
                      className={viewMode === "grid" ? "p-0" : "p-6 flex gap-6"}
                    >
                      <div
                        className={viewMode === "grid" ? "" : "flex-shrink-0"}
                      >
                        <div
                          className={
                            viewMode === "grid"
                              ? "aspect-[1/1.2] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl relative"
                              : "w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl relative"
                          }
                        >
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            className={
                              viewMode === "grid"
                                ? "w-full h-full object-cover rounded-t-xl"
                                : "w-full h-full object-cover rounded-xl"
                            }
                          />
                          {product.discount?.isActive &&
                            product.discount.percentage > 0 && (
                              <div className="absolute top-3 left-3 px-2 py-1 text-xs bg-red-500 text-white rounded-full font-medium shadow-sm">
                                {product.discount.percentage}% OFF
                              </div>
                            )}
                        </div>
                      </div>

                      <div
                        className={
                          viewMode === "grid" ? "p-6" : "flex-1 min-w-0"
                        }
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-base text-gray-800 line-clamp-2 leading-snug flex-1 pr-2">
                            {product.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
                          >
                            <Heart className="h-4 w-4 text-gray-400 hover:text-red-400 transition-colors duration-200" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">
                              {product.ratings?.average || 5.0}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.ratings?.count || 0} reviews)
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xl font-bold text-gray-800">
                              ${product.price}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice !== product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                          </div>

                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-full bg-black text-white hover:bg-gray-800 text-sm px-4 py-3 rounded-xl border-2 border-black font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                            disabled={product.stock?.quantity === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.stock?.quantity === 0
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className=" text-gray-600 hover:bg-gray-50 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === pagination.currentPage
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            pageNum === pagination.currentPage
                              ? "w-12 h-12 rounded-xl bg-black text-white shadow-sm"
                              : "w-12 h-12 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:-translate-y-0.5"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:-translate-y-0.5"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
