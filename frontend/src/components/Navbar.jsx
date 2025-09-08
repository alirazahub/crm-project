"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import Profile from "./Profile";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 font-sans shadow-md shadow-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/customer/homepage"
              className="text-2xl font-bold text-black hover:text-gray-700 transition-colors duration-200 font-sans"
            >
              GLOBUY
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/customer/homepage"
              className="text-gray-600 hover:text-black font-medium transition-colors duration-200 font-sans"
            >
              Home
            </Link>
            <Link
              href="/customer/filter"
              className="text-gray-600 hover:text-black font-medium transition-colors duration-200 font-sans"
            >
              Products
            </Link>
            <Link
              href="/customer/contactUs"
              className="text-gray-600 hover:text-black font-medium transition-colors duration-200 font-sans"
            >
              Contact Us
            </Link>

            {isAuthenticated && user?.role === "user" && (
              <Link
                href="/customer/cart"
                className="relative p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 group"
              >
                <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-black transition-colors duration-200" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium font-sans">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <Profile user={user} />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium font-sans"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && user?.role === "user" && (
              <Link
                href="/customer/cart"
                className="relative p-2 rounded-full hover:bg-gray-50 transition-colors duration-200 group mr-2"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors duration-200" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium font-sans">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/customer/homepage"
                className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium font-sans"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/customer/filter"
                className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium font-sans"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/customer/contactUs"
                className="block px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium font-sans"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              {!isAuthenticated && (
                <Link
                  href="/sign-in"
                  className="block mx-3 mt-4 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium text-center font-sans"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
