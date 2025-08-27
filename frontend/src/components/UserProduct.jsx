"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { fetchProducts } from "@/store/slices/productSlice"
import { addToCart } from "@/store/slices/cartSlice"

export default function UserProducts() {
  const { products, loading, error } = useSelector((state) => state.product)
  const { token } = useSelector((state) => state.auth) 
  const dispatch = useDispatch()
  const router = useRouter()

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleAddToCart = (product) => {
    if (!token) {
      alert("Please login to add items to your cart.")
      return
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      }),
    )
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error while fetching products: {error}</p>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">No products available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-white text-center tracking-tight">Shop Our Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => router.push(`/customer/products/${product._id}`)}
              className="group cursor-pointer bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col justify-between hover:bg-black hover:border-gray-500 hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div onClick={(e) => e.stopPropagation()}>
                {product.images && product.images[0] && (
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log("[v0] Image failed to load:", product.images[0])
                        e.target.src = "/placeholder.svg"
                      }}
                      onLoad={() => {
                        console.log("[v0] Image loaded successfully:", product.images[0])
                      }}
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100 transition-colors">
                  {product.name}
                </h2>

                <p className="text-lg font-bold text-gray-300 mb-2">${product.price?.toFixed(2)}</p>

                <p className="text-sm text-gray-400 mb-6 line-clamp-3">
                  {product.description ? product.description.slice(0, 100) + "..." : "No description available"}
                </p>
              </div>

              <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 bg-zinc-800 text-white font-semibold py-3 px-4 rounded-lg border border-gray-500 hover:bg-800 hover:border-gray-400 transition-all duration-200 hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
