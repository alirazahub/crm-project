"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";

export default function UserProducts() {
  const { products, loading, error } = useSelector((state) => state.product);
  const { user, token } = useSelector((state) => state.auth); // ✅ use Redux auth
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!token) {  // ✅ check Redux token instead of NextAuth
      alert("Please login to add items to your cart.");
      return;
    }

    console.log("Adding to cart:", product);

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      })
    );
  };

  const handleShopNow = (productId) => {
    router.push(`/product/${productId}`);
  };

  // UI states
  if (loading) {
    return <p className="text-gray-500 text-lg p-8">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-lg p-8">
        Error while fetching products: {error}
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="text-gray-500 text-lg p-8">
        No products available at the moment.
      </p>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Shop Our Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              {/* ✅ Show image if available */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span>{" "}
                {product.category || "N/A"}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Price:</span> $
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : "0.00"}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Description:</span>{" "}
                {product.description
                  ? product.description.length > 100
                    ? product.description.slice(0, 100) + "..."
                    : product.description
                  : "No description"}
              </p>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-md py-2 font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleShopNow(product._id)}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
