"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
//import GoogleSignUp from "../../components/GoogleSignUp";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";

export default function signIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
      e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    console.log("Login Result:", result);

    if (result.meta.requestStatus === "fulfilled") {
      const role = result.payload.user?.role;  
      console.log("User Role:", role);

      if (role === "admin") {
        router.replace("/dashboard");
      } else if (role === "user") {
        router.replace("/customer/homepage");
      }
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Sign In
        </h2>

        {/* Google Sign In Button 
        <GoogleSignUp />*/}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              suppressHydrationWarning
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
                suppressHydrationWarning
              onChange={handleChange}
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
