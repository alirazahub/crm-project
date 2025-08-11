'use client'

import { useState } from 'react' ;
import { useRouter } from 'next/navigation';
import GoogleSignUp from '../../components/GoogleSignUp';

export default function signUp(){

  const [error , setError ] = useState(null) ;
  const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        const email = e.target.email.value ;
        const password = e.target.password.value ;
         console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // Debug
        console.log('sending ' , email , password) ;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sign-in` , {
            method: "post" ,
            headers: {
               'Content-Type': 'application/json',
              },
            body: JSON.stringify({
              email,
              password
  }),
        });
        const data = await response.json();
        console.log(data);
        
        if(data.error) {
          setError(data.error) ;
        }
        else if(response.status === 200) {
          // Check user role and redirect accordingly
          if (data.user && data.user.role === "admin") {
            router.replace('/dashboard');
          } else {
            router.replace('/customer/homepage');
          }
        }
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Sign In</h2>
                
                {/* Google Sign In Button */}
                <GoogleSignUp />
                
                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {error && (
                        <p className="text-center text-red-600 font-semibold py-2 px-4">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}