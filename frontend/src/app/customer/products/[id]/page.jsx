"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, clearSelectedProduct } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { token } = useSelector((state) => state.auth);
  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    alert("Added to cart");
  };

  const handleBuyNow = () => {
    if (!token) {
      alert("Please login to continue.");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    router.push("/customer/checkout");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <Loader2 className="animate-spin text-black w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 text-red-600">
        <p className="text-lg font-semibold">❌ {error}</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4 border-black text-black hover:bg-black hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 text-neutral-500">
        <p className="text-lg">No product found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-neutral-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-neutral-200">
        
        {/* Left: Product Image */}
        <div className="p-6 md:p-10 bg-neutral-50 flex items-center justify-center">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="rounded-xl w-full h-[400px] object-cover shadow-lg hover:scale-105 transition-transform grayscale hover:grayscale-0"
              onError={(e) => (e.target.src = "/placeholder.svg")}
            />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-neutral-200 rounded-xl">
              <span className="text-neutral-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="p-6 md:p-10 flex flex-col space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">{product.name}</h1>

          {/* Pricing & Discount */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-semibold text-neutral-800">${product.price}</p>
            {product.originalPrice && (
              <p className="text-lg line-through text-neutral-500">${product.originalPrice}</p>
            )}
            {product.discount?.isActive && (
              <span className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg">
                {product.discount.percentage}% OFF
              </span>
            )}
          </div>

          {/* Category, Brand & Tags */}
          <p className="text-neutral-600">
            <strong>Category:</strong> {product.category}{" "}
            {product.subcategory && `> ${product.subcategory}`}
          </p>
          {product.brand && <p className="text-neutral-600"><strong>Brand:</strong> {product.brand}</p>}
          {product.tags?.length > 0 && (
            <p className="text-neutral-600"><strong>Tags:</strong> {product.tags.join(", ")}</p>
          )}

          {/* Stock Status */}
          <p className="text-sm font-medium">
            {product.stock?.quantity > 0 ? (
              <span className="text-green-600">In Stock ({product.stock.quantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < product.ratings?.average ? "fill-yellow-500" : "fill-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-neutral-600">
              {product.ratings?.average?.toFixed(1)} / 5 ({product.ratings?.count} reviews)
            </span>
          </div>

          {/* Description */}
          <p className="text-neutral-700 leading-relaxed">{product.description}</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-auto">
            <Button
              onClick={handleAddToCart}
              className="flex items-center px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition bg-black hover:bg-neutral-800 text-white text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex items-center px-6 py-3 rounded-xl text-lg border-black text-black hover:bg-black hover:text-white transition"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
