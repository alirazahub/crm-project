"use client";

import { useRouter, usePathname } from "next/navigation";
import { createUser } from "@/lib/actions";

export default function AssignRole() {
  const router = useRouter();
  const pathname = usePathname();

  const roles = ["manager", "sales"];

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      <div className="container mx-auto p-4 relative z-10">
        {/* Content Area */}
        <div className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="flex items-center justify-center min-h-[80vh]">
            <form
              action={createUser}
              className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm shadow-xl rounded-lg p-8 w-full max-w-md space-y-6"
            >
              <h2 className="text-2xl font-bold text-slate-100">Create User</h2>

              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  name="fullname"
                  type="text"
                  id="fullname"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  id="email"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  id="password"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className="bg-slate-800 text-slate-100"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-lg"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
