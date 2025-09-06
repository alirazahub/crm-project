"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import Profile from "@/components/Profile";

export default function AdminHeader() {
  const [theme, setTheme] = useState("dark");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/sign-in");
    else if (user?.role !== "admin") router.replace("/customer/homepage");
  }, [isAuthenticated, user, router]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="flex items-center justify-between py-1 border-b border-slate-700/50 pb-3   mb-2">
      <div className="flex items-center space-x-2">
        <Store className="h-8 w-8 text-cyan-500" />
        <span className="text-xl font-bold bg-cyan-400 bg-clip-text text-transparent">
          Dashboard
        </span>
      </div>

      <div className="flex items-center space-x-6 text-">
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-100 hover:text-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Order Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-slate-400 hover:text-slate-100"
                >
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Profile user={user} />
        </div>
      </div>
    </header>
  );
}
