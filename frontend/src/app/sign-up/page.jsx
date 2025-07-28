'use client'

import { useState } from 'react' ;
import { useRouter } from 'next/navigation';

export default function signUp(){

  const [error , setError ] = useState(null) ;
  const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        const email = e.target.email.value ;
        const password = e.target.password.value ;
         console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Debug
        console.log('sending ' , email , password) ;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-up` , {
            method: "post" ,
            headers: {
               'Content-Type': 'application/json',
              },
            body: JSON.stringify({
              email,
              password
  }),
        });
        const {error} = await response.json();
        console.log(error);
        if(error)
        {
          setError(error) ;
        }
        else if(response.status === 200)
          router.replace('/dashboard');

    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="mb-4 text-center text-red-600 font-semibold  py-2 px-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
    );
}