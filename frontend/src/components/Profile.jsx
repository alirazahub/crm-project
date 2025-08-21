'use client'
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Profile({user}){
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter() ;

  const toggleMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleLogout = () => {
      dispatch(logoutUser());
      router.push("/customer/homepage");
    };

  return (
    <div className="relative inline-block text-left">
      <div onClick={toggleMenu} className="cursor-pointer">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Admin"
          />
          <AvatarFallback className="bg-slate-700 text-cyan-500">
            EA
          </AvatarFallback>
        </Avatar>
      </div>

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
  );
}