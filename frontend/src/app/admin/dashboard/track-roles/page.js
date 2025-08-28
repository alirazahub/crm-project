//track-roles/page.js
import { cookies } from "next/headers";
import api from "@/utils/api";
import AdminSidebar from "@/components/AdminSideBar";
import AdminHeader from "@/components/AdminHeader";
import { Users, UserCheck, Shield } from "lucide-react";

export default async function TrackRoles() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token").value;
  console.log(token);

  const res = await api.get("/track-roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = res.data;

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
        {/* Content Area */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="space-y-6 w-full max-w-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-100 mb-2">
                  Role Overview
                </h1>
                <p className="text-slate-400">
                  Track user roles and their distribution
                </p>
              </div>

              {/* Users Card */}
              <div className="group flex justify-between items-center p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg shadow-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-slate-100">
                      Total Users
                    </span>
                    <p className="text-sm text-slate-400">
                      All registered users
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-400">
                    {data.users.count}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 text-2xl">
                    →
                  </span>
                </div>
              </div>

              {/* Sales Card */}
              <div className="group flex justify-between items-center p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg shadow-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                    <UserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-slate-100">
                      Sales Team
                    </span>
                    <p className="text-sm text-slate-400">
                      Sales representatives
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-green-400">
                    {data.sales.count}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400 text-2xl">
                    →
                  </span>
                </div>
              </div>

              {/* Managers Card */}
              <div className="group flex justify-between items-center p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg shadow-xl hover:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/30">
                    <Shield className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-slate-100">
                      Managers
                    </span>
                    <p className="text-sm text-slate-400">Management team</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-amber-400">
                    {data.managers.count}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 text-2xl">
                    →
                  </span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {Math.round((data.sales.count / data.users.count) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Sales Ratio</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((data.managers.count / data.users.count) * 100)}
                    %
                  </div>
                  <div className="text-sm text-slate-400">Manager Ratio</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {data.sales.count + data.managers.count}
                  </div>
                  <div className="text-sm text-slate-400">Total Staff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
