"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice"; 


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log(user , isAuthenticated) ;
  const { totalQuantity } = useSelector((state) => state.cart); // ✅ get cart count

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutUser());
    router.push("/customer/homepage");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              CRM
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-black">Products</Link>
            <Link href="/contact" className="text-gray-700 hover:text-black">Contact</Link>
            
            { isAuthenticated && user.role === 'user' && (
              <Link href="/customer/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-black" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
            )
            }

            {/* Profile and Logout Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-black focus:outline-none"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.fullname || "Profile"}</span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.fullname}</p>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 p-2"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            <button onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" className="block text-gray-700 hover:text-black">Home</Link>
          <Link href="/products" className="block text-gray-700 hover:text-black">Products</Link>
          <Link href="/contact" className="block text-gray-700 hover:text-black">Contact</Link>
          <Link href="/customer/cart" className="block text-gray-700 hover:text-black">
            Cart ({totalQuantity})
          </Link>

          {/* Mobile Profile Info */}
          {isAuthenticated && (
            <>
              <div className="border-t pt-2 mt-2">
                <p className="text-sm font-medium text-gray-700">{user?.fullname}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-800 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
