'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        console.error('Delete request failed');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen py-10 px-5 bg-gradient-to-br from-white-700 to-white-600  font-sans">
      <h1 className="text-3xl text-purple font-bold text-center mb-8">All Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white text-gray-800 rounded-xl p-6 shadow-md"
            >
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p><span className="font-medium">Brand:</span> {product.brand}</p>
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Price:</span> ${product.price}</p>
              <p><span className="font-medium">Description:</span> {product.description}</p>
              <p><span className="font-medium">Tags:</span> {product.tags?.join(', ') || 'N/A'}</p>

              {product.images?.length > 0 && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full max-w-xs mt-4 rounded-md"
                />
              )}

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => router.push(`/${product._id}`)}
                  className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-zinc-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
