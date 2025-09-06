"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchFilteredProducts } from "../../../store/slices/productSlice"
import { addToCart } from "../../../store/slices/cartSlice"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Slider } from "../../../components/ui/slider"
import { Grid, List, Search, Filter, ShoppingCart, Heart, Star } from "lucide-react"

export default function FilterPage() {
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useSelector((state) => state.auth)

  const productsState = useSelector((state) => state.product)
  const { filteredProducts, loading, error, pagination, filterOptions } = productsState || {
    filteredProducts: [],
    loading: false,
    error: null,
    pagination: null,
    filterOptions: { categories: [], brands: [], tags: [] },
  }

  console.log("[v0] Products State:", productsState)
  console.log("[v0] Filtered Products:", filteredProducts)
  console.log("[v0] Filter Options:", filterOptions)
  console.log("[v0] Loading:", loading)
  console.log("[v0] Error:", error)

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
    }

    // Add search term if provided
    if (searchTerm.trim()) {
      // For search, we'll filter on frontend since backend doesn't have search endpoint
      filters.searchTerm = searchTerm.trim()
    }

    console.log("[v0] Dispatching fetchFilteredProducts with filters:", filters)

    dispatch(fetchFilteredProducts(filters))
      .then((result) => {
        console.log("[v0] fetchFilteredProducts SUCCESS:", result)
      })
      .catch((error) => {
        console.log("[v0] fetchFilteredProducts ERROR:", error)
        alert("Error fetching products: " + error.message)
      })
  }, [dispatch, selectedCategory, selectedBrand, priceRange, sortBy, sortOrder, currentPage])

  useEffect(() => {
    console.log("[v0] Component mounted, fetching initial products...")
    // Fetch all products initially to get filter options
    dispatch(fetchFilteredProducts({ limit: 12, page: 1 }))
      .then((result) => {
        console.log("[v0] Initial fetch SUCCESS:", result)
      })
      .catch((error) => {
        console.log("[v0] Initial fetch ERROR:", error)
        alert("Error loading initial products: " + error.message)
      })
  }, [dispatch])

  const searchFilteredProducts = searchTerm.trim()
    ? filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : filteredProducts

  const handleAddToCart = (product) => {
    if (!user) {
      router.push("/login")
      return
    }
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        quantity: 1,
      }),
    )
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split("-")
    setSortBy(field)
    setSortOrder(order || "desc")
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const maxPrice = Math.max(10000, ...filteredProducts.map((p) => p.price || 0))

  if (loading) {
    console.log("[v0] Showing loading state")
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    console.log("[v0] Showing error state:", error)
    alert("Error in component: " + error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  console.log("[v0] Rendering products. Count:", searchFilteredProducts.length)
  console.log("[v0] Available categories:", filterOptions.categories)
  console.log("[v0] Available brands:", filterOptions.brands)

  return (
    <div className="min-h-screen bg-black text-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Products</h1>
            <p className="text-gray-400">
              {searchFilteredProducts.length} products found
              {pagination && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
            </p>
          </div>

          {/* View Toggle & Filter Toggle */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Filters</h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      console.log("[v0] Category selected:", e.target.value)
                      setSelectedCategory(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories?.length > 0 ? (
                      filterOptions.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories available</option>
                    )}
                  </select>
                  <small className="text-gray-500">
                    Debug: {filterOptions.categories?.length || 0} categories loaded
                  </small>
                </div>

                {/* Brand */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      console.log("[v0] Brand selected:", e.target.value)
                      setSelectedBrand(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="all">All Brands</option>
                    {filterOptions.brands?.length > 0 ? (
                      filterOptions.brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))
                    ) : (
                      <option disabled>No brands available</option>
                    )}
                  </select>
                  <small className="text-gray-500">Debug: {filterOptions.brands?.length || 0} brands loaded</small>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value)
                      setCurrentPage(1)
                    }}
                    max={maxPrice}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="createdAt-desc">Latest</option>
                    <option value="createdAt-asc">Oldest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedBrand("all")
                    setPriceRange([0, 10000])
                    setSortBy("createdAt")
                    setSortOrder("desc")
                    setCurrentPage(1)
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid/List */}
          <div className="lg:w-3/4">
            {searchFilteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
                  <strong>Debug Info:</strong>
                  <br />
                  Total products: {filteredProducts.length}
                  <br />
                  Search term: "{searchTerm}"<br />
                  Selected category: {selectedCategory}
                  <br />
                  Selected brand: {selectedBrand}
                  <br />
                  Price range: ${priceRange[0]} - ${priceRange[1]}
                  <br />
                  Loading: {loading ? "Yes" : "No"}
                  <br />
                  Error: {error || "None"}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedBrand("all")
                    setPriceRange([0, 10000])
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {searchFilteredProducts.map((product) => (
                  <Card key={product._id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                      <div className={viewMode === "grid" ? "" : "flex-shrink-0"}>
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className={
                            viewMode === "grid"
                              ? "w-full h-48 object-cover rounded-lg mb-4"
                              : "w-24 h-24 object-cover rounded-lg"
                          }
                        />
                      </div>

                      <div className={viewMode === "grid" ? "" : "flex-1"}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.ratings?.average || 0}</span>
                          </div>
                          <span className="text-sm text-gray-500">({product.ratings?.count || 0} reviews)</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{product.category}</Badge>
                          {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                          {product.isFeatured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>

                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">${product.price}</span>
                            {product.originalPrice && product.originalPrice !== product.price && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                             onClick={() => router.push(`/customer/products/${product._id}`)}                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(product)}
                              className="bg-black text-white hover:bg-gray-800"
                              disabled={product.stock?.quantity === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              {product.stock?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
