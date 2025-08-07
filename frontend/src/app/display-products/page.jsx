'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
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
    <div className='m-6'>
      <h1>All Products</h1>
      {products.length === 0 && <p>No products found.</p>}

      {products.map((product) => (
        <div key={product._id}>
          <p>{product.name}</p>
          <button onClick={() => router.push(`/${product._id}`)}>Edit</button>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
