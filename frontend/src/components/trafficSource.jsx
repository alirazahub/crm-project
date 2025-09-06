"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  DollarSign,
  MessageSquare,
  Mic,
  PackagePlus,
  PackageSearch,
  RefreshCw,
  Shield,
  ShoppingBag,
  Star,
  Users,
  Globe,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import MetricCard from "@/components/MetricCard";
// Traffic source component
export default function TrafficSource({ name, visitors, percentage }) {
  const getColor = () => {
    switch (name) {
      case "Facebook":
        return "bg-blue-500";
      case "YouTube":
        return "bg-red-500";
      case "Instagram":
        return "bg-purple-500";
      case "WhatsApp":
        return "bg-green-500";
      case "Direct":
        return "bg-gray-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm text-slate-400 flex items-center">
          <div className={`w-2 h-2 rounded-full ${getColor()} mr-2`}></div>
          {name}
        </div>
        <div className="text-xs text-slate-400">{percentage}%</div>
      </div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="text-slate-500">
          {visitors.toLocaleString()} visitors
        </div>
      </div>
      <Progress value={percentage} className="h-1.5 bg-slate-700">
        <div
          className={`h-full rounded-full ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </Progress>
    </div>
  );
}
