'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    // Implement your add-to-cart logic here
    alert(`Added "${product.name}" to cart!`);
  };

  const handleShopNow = (productId) => {
    router.push(`/product/${productId}`); // Assuming this is your product detail page route
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Shop Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Category:</span> {product.category || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Price:</span> ${product.price?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Description:</span>{' '}
                {product.description?.length > 100
                  ? product.description.slice(0, 100) + '...'
                  : product.description || 'No description'}
              </p>
            </div>

            <div className="flex gap-4">
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
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
