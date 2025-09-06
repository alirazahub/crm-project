"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { fetchCart } from "../../store/slices/cartSlice";
import { motion } from "framer-motion";

export default function SignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(fetchCart());
      const role = result.payload.user?.role;
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "user") router.push("/customer/homepage");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white text-black overflow-hidden">
      {/* Background floating circles */}
      <motion.div
        className="absolute w-72 h-72 bg-black/5 rounded-full blur-3xl -top-10 -left-10"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-black/10 rounded-full blur-3xl bottom-0 right-0"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200 relative z-10"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-6"
        >
          Sign In
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="peer w-full px-4 py-2 border-b-2 border-gray-300 bg-transparent text-black placeholder-transparent focus:outline-none focus:border-black"
              placeholder="you@example.com"
            />
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all peer-focus:w-full" />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
              className="peer w-full px-4 py-2 border-b-2 border-gray-300 bg-transparent text-black placeholder-transparent focus:outline-none focus:border-black pr-10"
              placeholder="••••••••"
            />
            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-black"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all peer-focus:w-full" />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-red-600 font-medium"
            >
              {error}
            </motion.p>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold transition"
          >
            Sign In
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Don’t have an account?{" "}
          <a href="/signUp" className="text-black font-medium hover:underline">
            Sign Up
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
