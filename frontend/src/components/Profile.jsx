"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, Settings } from "lucide-react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/store/slices/authSlice"

export default function Profile({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    setIsOpen(false)
    router.push("/")
  }

  const handleProfile = () => {
    setIsOpen(false)
    router.push("/profile")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-black focus:outline-none"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:block">{user?.name || user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user?.name || "User"}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>

          <button
            onClick={handleProfile}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
