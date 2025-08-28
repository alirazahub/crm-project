"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PackagePlus,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SalerSidebar({ currentPath }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
        <CardContent className="p-4">
          <nav className="space-y-2">
            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={currentPath === "/salesMan/dashboard"}
              link="/salesMan/dashboard"
            />
            <NavItem
              icon={PackagePlus}
              label="Add Sales"
              active={currentPath === "/salesMan/saleForm"}
              link="/salesMan/saleForm"
            />
            <NavItem
              icon={Tag}
              label="View Reports"
              active={currentPath === "/salesMan/salesReport"}
              link="/salesMan/salesReport"
            />
            <NavItem
              icon={Tag}
              label="Feedback"
              active={currentPath === "/salesMan/feedback"}
              link="/salesMan/feedback"
            />
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

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
