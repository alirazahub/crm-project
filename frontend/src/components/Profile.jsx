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
        className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 focus:outline-none transition-colors duration-200"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:block text-sm font-medium">{user?.name || user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 py-2 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-4 py-3 text-xs border-b border-slate-700/50">
            <div className="font-medium text-slate-100">{user?.name || "User"}</div>
            <div className="text-slate-400 mt-1">{user?.email}</div>
          </div>

          <button
            onClick={handleProfile}
            className="flex items-center w-full px-4 py-3 text-xs text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-3 text-slate-400" />
            Profile Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-xs text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
