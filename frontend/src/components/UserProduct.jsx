"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { fetchProducts } from "@/store/slices/productSlice"
import { addToCart } from "@/store/slices/cartSlice"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Eye, ArrowRight, ImageIcon, Heart, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserProducts() {
  const { products, loading, error } = useSelector((state) => state.product)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddToCart = (product) => {
    if (!token) {
      alert("Please login to add items to your cart.")
      return
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
  }

  const handleBuyNow = (product) => {
    if (!token) {
      alert("Please login to continue.")
      return
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }))
    router.push("/customer/checkout")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Loading Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="w-64 h-12 bg-gray-200 rounded-lg mx-auto animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <Skeleton className="w-full h-80 rounded-xl mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <div className="text-red-500 text-4xl">⚠️</div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Something went wrong</h3>
            <p className="text-gray-600 leading-relaxed">We couldn't load the products. Please try again.</p>
          </div>
          <Button
            onClick={() => dispatch(fetchProducts())}
            className="px-8 py-3 bg-black text-white font-semibold tracking-wide hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <div className="text-gray-400 text-4xl">📦</div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">No Products Available</h3>
            <p className="text-gray-600 leading-relaxed">
              Our collection is being updated. Check back soon for new arrivals.
            </p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-black text-white font-semibold tracking-wide hover:bg-gray-800 transition-colors"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white py-20 lg:py-32 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header - Enhanced */}
        <div className="text-center mb-20 space-y-8">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-medium tracking-widest">
            <TrendingUp className="w-4 h-4" />
            FEATURED COLLECTION
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-bold text-black leading-none tracking-tight text-balance">
              PREMIUM
              <span className="block text-gray-400">PRODUCTS</span>
            </h2>
            <div className="w-16 h-0.5 bg-black mx-auto" />
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Carefully curated selection of contemporary fashion pieces that define modern style and exceptional quality.
          </p>
        </div>

        {/* Products Grid - Completely Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <Card
              key={product._id}
              className="group cursor-pointer bg-white border-0 rounded-none shadow-none hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Product Image Container */}
                <div className="relative w-full h-96 lg:h-[480px] overflow-hidden bg-gray-50">
                  {/* Image Slider Effect */}
                  <div className="flex w-full h-full transition-transform duration-700 ease-in-out group-hover:translate-x-[-100%]">
                    <img
                      src={
                        product.images?.[0] ||
                        "/placeholder.svg?height=480&width=360&query=premium fashion product" ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      className="min-w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => (e.target.src = "/premium-fashion-product.jpg")}
                    />
                    {product.images?.[1] && (
                      <img
                        src={product.images[1] || "/placeholder.svg"}
                        alt={`${product.name} alternate view`}
                        className="min-w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => (e.target.src = "/premium-fashion-product-alternate.jpg")}
                      />
                    )}
                    {!product.images?.[0] && !product.images?.[1] && (
                      <div className="min-w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="text-sm font-medium">No Image Available</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-10 h-10 bg-white/90 hover:bg-white text-black shadow-lg backdrop-blur-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sale Badge */}
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold tracking-widest">
                    NEW
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black uppercase tracking-wide line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">${product.price?.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2 font-medium">(4.8)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {product.description ||
                      "Premium quality craftsmanship meets contemporary design in this exceptional piece."}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex gap-3 p-6 pt-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  onClick={() => handleAddToCart(product)}
                  variant="outline"
                  className="flex-1 border-2 border-black text-black font-bold py-3 px-4 hover:bg-black hover:text-white transition-all duration-300 active:scale-95 group tracking-wide"
                >
                  <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  ADD TO CART
                </Button>
                <Button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 bg-black text-white font-bold py-3 px-4 hover:bg-gray-800 transition-all duration-300 active:scale-95 group tracking-wide"
                >
                  BUY NOW
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All CTA - Enhanced */}
        <div className="text-center mt-20 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
          <Button
            asChild
            className="inline-flex items-center justify-center px-12 py-4 bg-black text-white font-bold text-lg tracking-widest hover:bg-gray-800 transition-all duration-300 group"
          >
            <a href="/customer/filter">
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
