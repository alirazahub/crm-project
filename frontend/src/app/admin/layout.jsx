"use client";

import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSideBar";

export default function CustomerLayout({ children, currentPath = "/" }) {
  return (
    <div className="dark h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 w-600">
        <div className="container mx-auto p-4 relative z-10">
          <AdminHeader />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-64 lg:w-72 sticky top-0 h-screen mx-2">
          <AdminSidebar currentPath={currentPath} />
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full bg-slate-900/50 border  rounded-xl shadow-lg  backdrop-blur-sm min-h-[80vh]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
