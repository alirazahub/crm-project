"use client";
import { useRouter } from "next/navigation";
import {
  Store,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Tag,
  ShoppingBag,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSidebar({ currentPath }) {
  const router = useRouter();

  return (
    <div className="space-y-2">
      {/* Navigation Card */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full bg-gradient-to-br from-black text-slate-100">
        <CardContent className="p-4">
          <nav className="space-y-2">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={currentPath === "/admin/dashboard"}
              link="/admin/dashboard"
            />
            <NavItem
              icon={PackagePlus}
              label="Add Products"
              active={currentPath === "/admin/createProducts"}
              link="/admin/createProducts"
            />
            <NavItem
              icon={PackageSearch}
              label="Product list"
              active={currentPath === "/admin/display-products"}
              link="/admin/display-products"
            />
           
            {/* <NavItem
              icon={Tag}
              label="Track Employees"
              active={currentPath === "/admin/dashboard/track-roles"}
              link="/admin/dashboard/track-roles"
            /> */}
            <NavItem
              icon={ShoppingBag}
              label="Orders"
              active={currentPath === "/admin/sales/orders"}
              link="/admin/sales/orders"
            />
            <NavItem
              icon={Users}
              label="User Accounts"
              active={currentPath === "/admin/user"}
              link="/admin/user"
            />
            <NavItem
              icon={Tag}
              label="Feedback"
              active={currentPath === "/admin/feedback"}
              link="/admin/feedback"
            />
            {/* <NavItem
              icon={FileText}
              label="Assign Roles"
              active={currentPath === "/admin/dashboard/assign-roles"}
              link="/admin/dashboard/assign-roles"
            /> */}
          </nav>

          <div className="mt-10 pt-6 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 mb-2 font-mono">
              STORE STATUS
            </div>
            <div className="space-y-3 mt-8">
              <StatusItem
                label="Orders Processing"
                value={85}
                color="cyan"
              />
              <StatusItem
                label="Reviews"
                value={92}
                color="green"
              />
              <StatusItem
                label="Customer Satisfaction"
                value={88}
                color="blue"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced NavItem component with hover transitions
function NavItem({ icon: Icon, label, active, link }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(link)}
      variant="ghost"
      className={`w-full flex items-center justify-start gap-3 px-4 py-6 rounded-lg font-medium transition-all duration-300 border border-transparent group ${
        active
          ? "bg-gradient-to-r from-cyan-800/20 to-blue-800/20 text-cyan-500 border-l-4 border-cyan-500 shadow-md transform scale-[1.01]"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:shadow-lg hover:transform hover:scale-[1.02]"
      }`}
    >
      <Icon 
        className={`h-4 w-4 transition-all duration-300 ${
          active
            ? "text-cyan-500"
            : "text-slate-500 group-hover:text-cyan-400 group-hover:scale-110"
        }`}
      />
      <span className="transition-all duration-300">
        {label}
      </span>
      {active && (
        <ChevronRight className="ml-auto h-4 w-4 text-cyan-500 animate-pulse" />
      )}
      {!active && (
        <ChevronRight className="ml-auto h-4 w-4 text-transparent group-hover:text-slate-400 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
      )}
    </Button>
  );
}
// Enhanced StatusItem component with hover effects
function StatusItem({ label, value, color }) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500";
      case "green":
        return "from-green-500 to-emerald-500";
      case "blue":
        return "from-blue-500 to-indigo-500";
      case "purple":
        return "from-purple-500 to-pink-500";
      default:
        return "from-cyan-500 to-blue-500";
    }
  };

  return (
    <div className="group cursor-default">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
          {label}
        </div>
        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
          {value}%
        </div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden group-hover:h-2 transition-all duration-300">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full transition-all duration-500 group-hover:shadow-lg`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}