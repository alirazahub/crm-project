"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { setBuyNowProduct } from "@/store/slices/orderSlice";

export default function UserProducts() {
  const { products, loading, error } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth); // ✅ use Redux auth
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }


    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      })
    );
  };


 

const handleBuyNow = (product) => {
  if (!token) {
    alert("Please login to continue.");
    return;
  }
  // ✅ Add product to cart first
  dispatch(addToCart({ productId: product._id, quantity: 1 }));

  // ✅ Then redirect to checkout
  router.push("/customer/checkout");
};



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

      {/* ✅ product loop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => router.push(`/customer/products/${product._id}`)}
            className="cursor-pointer bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between hover:shadow-lg hover:scale-[1.02] transition transform"
          >
            {/* Content that doesn’t interfere with click */}
            <div onClick={(e) => e.stopPropagation()}>
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
                <span className="font-medium">Price:</span> $
                {product.price?.toFixed(2)}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                {product.description
                  ? product.description.slice(0, 100) + "..."
                  : "No description"}
              </p>
            </div>

            {/* ✅ Buttons won’t trigger navigation */}
            <div
              className="flex gap-4 mt-4"
              onClick={(e) => e.stopPropagation()} // stop card click
            >
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-grow bg-green-600 hover:bg-green-700 text-white rounded-md py-2 font-semibold transition"
              >
                Add to Cart
              </button>
             <button
          onClick={()=>handleBuyNow(product)}
          
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
