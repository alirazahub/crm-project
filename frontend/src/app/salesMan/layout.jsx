"use client";

import AdminHeader from "@/components/AdminHeader";
import SalerSidebar from "@/components/salerSideBar";

export default function CustomerLayout({ children, currentPath = "/" }) {
  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <AdminHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            < SalerSidebar currentPath={currentPath} />
          </div>

          {/* Main content area */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl shadow-lg p-6 backdrop-blur-sm min-h-[80vh]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
