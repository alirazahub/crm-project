"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSidebar({ currentPath }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Navigation Card */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
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
              label="View Products"
              active={currentPath === "/admin/display-products"}
              link="/admin/display-products"
            />
            <NavItem
              icon={Tag}
              label="Track Roles"
              active={currentPath === "/track-roles"}
              link="/admin/dashboard/track-roles"
            />
            <NavItem
              icon={ShoppingBag}
              label="Orders"
              active={currentPath === "/admin/sales/orders"}
              link="/admin/sales/orders"
            />
            <NavItem
              icon={Users}
              label="User Accounts"
              active={currentPath === "/Users"}
              link="/Users"
            />
            <NavItem
              icon={Tag}
              label="Feedback"
              active={currentPath === "/admin/feedback"}
              link="/admin/feedback"
            />
            <NavItem
              icon={FileText}
              label="Assign Roles"
              active={currentPath === "/admin/dashboard/assign-roles"}
              link="/admin/dashboard/assign-roles"
            />
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 mb-2 font-mono">
              STORE STATUS
            </div>
            <div className="space-y-3">
              <StatusItem
                label="Orders Processing"
                value={85}
                color="cyan"
              />
              <StatusItem
                label="Inventory Health"
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

// Component for nav items
function NavItem({ icon: Icon, label, active, link }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(link)}
      variant="ghost"
      className={`w-full justify-start transition-all duration-200 ${
        active
          ? "bg-slate-800/70 text-cyan-400 border-l-2 border-cyan-500"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

// Component for status items
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}