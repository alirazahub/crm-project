"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById, clearSelectedProduct } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, ArrowLeft } from "lucide-react";
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
        alert("added to cart");
  };
const handleBuyNow = (product) => {
  if (!token) {
    alert("Please login to continue.");
    return;  }
  // Add product to cart first
  dispatch(addToCart({ productId: product._id, quantity: 1 }));
      alert("added to cart.");
  // Redirect to checkout
  router.push("/customer/checkout");
};


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-500">
        <p className="text-lg font-semibold">❌ {error}</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <p className="text-lg">No product found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Product Image */}
        <div className="p-6 md:p-10 bg-gray-100 flex items-center justify-center">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="rounded-xl w-full h-[400px] object-cover shadow-md hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 rounded-xl">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="p-6 md:p-10 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold text-blue-600 mb-4">
            ${product.price}
          </p>

          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex gap-4 mt-auto">
            <Button
              onClick={handleAddToCart}
              className="flex items-center px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition bg-blue-600 hover:bg-blue-700 text-white text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex items-center px-6 py-3 rounded-xl text-lg"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
