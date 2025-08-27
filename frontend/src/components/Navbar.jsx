/*"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
import Profile from "./Profile"; 


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  //moved profile logic to profile component for reuse across admin and customer navbar

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log(user , isAuthenticated) ;
  const { totalQuantity } = useSelector((state) => state.cart); // ✅ get cart count

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
   
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              CRM
            </Link>
          </div>

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

            {isAuthenticated ? (
              <div className="relative">
                <Profile user={user} />
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


          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      
    </nav>
  );
}
*/


"use client"


import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";
import Profile from "./Profile"; 


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  //moved profile logic to profile component for reuse across admin and customer navbar

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  console.log(user, isAuthenticated)
  const { totalQuantity } = useSelector((state) => state.cart) // ✅ get cart count

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/customer/homepage"  className="text-xl font-bold text-gray-800">
              CRM
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/customer/homepage" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <Link href="/customer/filter"  className="text-gray-700 hover:text-black">
              Products
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black">
              Contact
            </Link>

            {isAuthenticated && user.role === "user" && (
              <Link href="/customer/cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-black" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}

            {/* Profile and Logout Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <Profile user={user} />
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
            <button onClick={toggleMenu}>{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
