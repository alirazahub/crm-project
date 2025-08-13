'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorize , setAuthorize] = useState('') ;
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authorize = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin`);
        if(authorize.status === 403 )
          return router.replace('/sign-in' ) ;
        console.log(authorize) ;
        const {message } = authorize.data ;
        console.log(message) ;
        setAuthorize(message) ;
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
  }, [ authorize]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Delete failed');
    }
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
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Product Management</h1>
      <h2>{authorize}</h2>
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
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Stock Quantity:</span>{' '}
                {product.stock?.quantity ?? 'N/A'}
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
                onClick={() => router.push(`/edit-product/${product._id}`)}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex-grow bg-red-600 hover:bg-red-700 text-white rounded-md py-2 font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
