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
  className="group cursor-pointer bg-white text-black rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between 
             hover:shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-2"
>
  <div onClick={(e) => e.stopPropagation()}>
    {product.images && product.images[0] && (
      <div className="relative overflow-hidden rounded-xl mb-6">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "/placeholder.svg")}
        />
      </div>
    )}

    <h2 className="text-xl font-bold mb-2 group-hover:text-zinc-800">
      {product.name}
    </h2>

    <p className="text-lg font-semibold text-zinc-700 mb-2">
      ${product.price?.toFixed(2)}
    </p>

    <p className="text-sm text-zinc-500 mb-6 line-clamp-3">
      {product.description ? product.description.slice(0, 100) + "..." : "No description available"}
    </p>
  </div>

  <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
    <button
      onClick={() => handleAddToCart(product)}
      className="flex-1 bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-zinc-800 transition-all duration-200 hover:shadow-lg"
    >
      Add to Cart
    </button>
    <button
      onClick={() => handleBuyNow(product)}
      className="flex-1 bg-white border border-zinc-300 text-black font-semibold py-3 px-4 rounded-lg hover:bg-zinc-100 transition-all duration-200 hover:shadow-lg"
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
