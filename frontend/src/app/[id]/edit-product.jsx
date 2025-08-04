'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProduct({ productPromise , id}) {
  const product = use(productPromise);
  const router = useRouter()
  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Automotive',
    'Food',
    'Toys',
    'Health',
  ];

  const saveChanges = async (e) =>{
  e.preventDefault() ;
  console.log(id , product);
  const formData = new FormData(e.target);
  const data = {
    name : formData.get('name') ,
    description: formData.get('description'),
    category: formData.get('category'),
    brand : formData.get('brand') ,
    price: formData.get('price')

  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`,
    {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }  
  )

  router.push('/display-products') ;
  
    
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <form onSubmit={saveChanges}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            name="description"
            defaultValue={product.description}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            defaultValue={product.category}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled>Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            name="brand"
            defaultValue={product.brand}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="text"
            name="price"
            defaultValue={product.price}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
      type="submit"
      className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow hover:bg-blue-700 transition duration-200"
      >
        Save Changes
        </button>

      </form>
    </div>
  );
}
