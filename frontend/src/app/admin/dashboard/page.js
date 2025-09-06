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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import MetricCard from "@/components/MetricCard";
import ActionButton from "@/components/actionButton";
import AlertItem from "@/components/alertItem";
import CommunicationItem from "@/components/communicationItem";
import SalesChart from "@/components/salesChart";
import TransactionItem from "@/components/transactionItem";
import api from "@/utils/api";
import Loader from "@/components/loader";

export default function Dashboard() {
  // Existing states
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);

  // Safe selector with fallback
  const authState = useSelector((state) => state?.auth || {});
  const { user = null, isAuthenticated = false } = authState;

  const canvasRef = useRef(null);
  const router = useRouter();

  // Function to fetch data from your API
  const fetchDashboardData = async () => {
    try {
      const [revenueRes, salesRes] = await Promise.all([
        api.get("/orders/total-revenue"),
        api.get("/orders/total-sales"),
      ]);
      setTotalRevenue(revenueRes?.data?.totalRevenue || 0);
      setTotalSalesCount(salesRes?.data?.totalSales || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setTotalRevenue(0);
      setTotalSalesCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await api.get("/all-users");
      setTotalUsers(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      setTotalUsers(0);
    }
  };

  // Initial loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    fetchTotalUsers();
    fetchDashboardData();

    return () => clearTimeout(timer);
  }, []);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/sign-in");
    } else if (user?.role !== "admin") {
      router.replace("/customer/homepage");
    }
  }, [isAuthenticated, user, router]);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency safely
  const formatCurrency = (amount) => {
    const numAmount = Number(amount) || 0;
    return numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center animate-fadeIn">
          <Loader />
          <p className="text-lg text-slate-300 mt-4 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Simplified CSS for clean animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
      `}</style>

      <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
        {/* Background particle effect */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-30"
        />

        <div className="container mx-auto p-4 relative z-10 max-w-7xl">
          {/* Main dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main dashboard content - left side */}
            <div className="lg:col-span-3">
              <div className="grid gap-6">
                {/* Business overview */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden animate-fadeInUp">
                  <CardHeader className="border-b border-slate-700/50 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-100 flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                        Business Overview
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-cyan-400 transition-all duration-300"
                          onClick={fetchDashboardData}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                        <MetricCard
                          title="Total Sales"
                          value={totalSalesCount}
                          icon={ShoppingBag}
                          trend="up"
                          color="cyan"
                          detail="From completed orders"
                          unit=""
                        />
                      </div>
                      <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
                        <MetricCard
                          title="Total Revenue"
                          value={formatCurrency(totalRevenue)}
                          icon={DollarSign}
                          trend="up"
                          color="green"
                          detail="From completed orders"
                          unit="$"
                        />
                      </div>
                      <div className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
                        <MetricCard
                          title="New Customers"
                          value={totalUsers}
                          icon={Users}
                          trend="up"
                          color="purple"
                          detail="13% increase"
                          unit=""
                        />
                      </div>
                      <div className="animate-fadeInUp" style={{ animationDelay: "400ms" }}>
                        <MetricCard
                          title="Growth Rate"
                          value={80}
                          icon={PackageSearch}
                          trend="stable"
                          color="blue"
                          detail="10% increase"
                          unit="% "
                        />
                      </div>
                    </div>

                    <div className="mt-8 animate-slideInUp">
                      <Tabs defaultValue="sales" className="w-full">
                        <div className="flex items-center justify-between mb-4">
                          <TabsList className="bg-slate-800/50 p-1">
                            <TabsTrigger
                              value="sales"
                              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400 transition-all duration-300"
                            >
                              Sales Analytics
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="sales" className="mt-0">
                          <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                            <SalesChart />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Transactions & Orders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-fadeInUp">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 flex items-center text-base">
                        <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                        Recent Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <TransactionItem
                          customer="John Smith"
                          amount={245.5}
                          time="14:32:12"
                          status="completed"
                        />
                        <TransactionItem
                          customer="Sarah Johnson"
                          amount={189.99}
                          time="13:45:06"
                          status="pending"
                        />
                        <TransactionItem
                          customer="Mike Wilson"
                          amount={67.25}
                          time="12:15:33"
                          status="completed"
                        />
                        <TransactionItem
                          customer="Emma Davis"
                          amount={456.8}
                          time="11:28:45"
                          status="completed"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-fadeInUp">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-slate-100 flex items-center text-base">
                        <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                        Order Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <AlertItem
                          title="Low Stock Alert"
                          time="14:32:12"
                          description="iPhone 13 Pro Max running low (5 units left)"
                          type="warning"
                        />
                        <AlertItem
                          title="New Order Received"
                          time="13:45:06"
                          description="Order #12456 placed by customer Sarah J."
                          type="info"
                        />
                        <AlertItem
                          title="Payment Processed"
                          time="12:15:33"
                          description="Payment of $456.80 successfully processed"
                          type="success"
                        />
                        <AlertItem
                          title="Inventory Updated"
                          time="09:12:45"
                          description="Product catalog sync completed successfully"
                          type="update"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Communications */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-slideInUp">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                      Customer Messages
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-slate-800/50 text-blue-400 border-blue-500/50"
                    >
                      3 Unread
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <CommunicationItem
                        sender="Customer Support"
                        time="15:42:12"
                        message="Customer inquiry about order #12456 delivery status and estimated arrival time."
                        avatar="/placeholder.svg?height=40&width=40"
                        unread
                      />
                      <CommunicationItem
                        sender="Review Alert"
                        time="14:30:45"
                        message="New 5-star review received for iPhone 13 Pro Max from verified customer."
                        avatar="/placeholder.svg?height=40&width=40"
                        unread
                      />
                      <CommunicationItem
                        sender="Return Request"
                        time="12:15:33"
                        message="Return request submitted for order #12234. Customer reports defective item."
                        avatar="/placeholder.svg?height=40&width=40"
                        unread
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-slate-700/50 pt-4">
                    <div className="flex items-center w-full space-x-2">
                      <input
                        type="text"
                        placeholder="Type a response..."
                        className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-300 focus:scale-[1.02] transform"
                      />
                      <Button
                        size="icon"
                        className="bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                      >
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-cyan-600 hover:bg-cyan-700 transition-all duration-300"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Store time */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden animate-fadeInUp">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-2 font-mono tracking-wider">
                          SYSTEM TIME
                        </div>
                        <div className="text-4xl font-mono text-cyan-400 mb-2 tracking-tight">
                          {formatTime(currentTime)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {formatDate(currentTime)}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-1">
                            Uptime
                          </div>
                          <div className="text-sm font-mono text-slate-200">
                            14d 06:42:18
                          </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                          <div className="text-xs text-slate-500 mb-1">
                            Time Zone
                          </div>
                          <div className="text-sm font-mono text-slate-200">
                            UTC-08:00
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-slideInUp">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-100 text-base">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      <ActionButton icon={PackagePlus} label="Add Product" />
                      <ActionButton icon={ShoppingBag} label="View Orders" />
                      <ActionButton icon={Users} label="Customers" />
                      <ActionButton icon={Star} label="Reviews" />
                    </div>
                  </CardContent>
                </Card>

                {/* Sales allocation */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-slideInUp">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-100 text-base">
                      Resource Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-slate-400">
                            Online Sales
                          </div>
                          <div className="text-xs text-cyan-400">
                            68% of total
                          </div>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            style={{ width: "68%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-slate-400">
                            Mobile App Sales
                          </div>
                          <div className="text-xs text-purple-400">
                            25% of total
                          </div>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-slate-400">
                            In-Store Pickup
                          </div>
                          <div className="text-xs text-blue-400">
                            7% of total
                          </div>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: "7%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-slate-400">Growth Target</div>
                          <div className="flex items-center">
                            <Slider
                              defaultValue={[4]}
                              max={5}
                              step={1}
                              className="w-24 mr-2"
                            />
                            <span className="text-cyan-400">4/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Store controls */}
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm animate-slideInUp">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-100 text-base">
                      Store Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Store className="text-cyan-500 mr-2 h-4 w-4" />
                          <Label className="text-sm text-slate-400">
                            Store Status
                          </Label>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="text-cyan-500 mr-2 h-4 w-4" />
                          <Label className="text-sm text-slate-400">
                            Order Notifications
                          </Label>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Shield className="text-cyan-500 mr-2 h-4 w-4" />
                          <Label className="text-sm text-slate-400">
                            Auto-Backup
                          </Label>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="text-cyan-500 mr-2 h-4 w-4" />
                          <Label className="text-sm text-slate-400">
                            Maintenance Mode
                          </Label>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}