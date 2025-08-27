"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  CircleOff,
  Command,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Fingerprint,
  ShoppingBag,
  Users,
  DollarSign,
  Database,
  Download,
  Globe,
  HardDrive,
  Hexagon,
  LineChart,
  Lock,
  LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sun,
  Terminal,
  Wifi,
  Zap,
  TrendingUp,
  Star,
  Tag,
  FileText,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge,badgeVariants } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSelector, useDispatch } from "react-redux";

export default function Dashboard() {
  
  const [theme, setTheme] = useState("dark");
  const [ordersReceived, setOrdersReceived] = useState(356);
  const [averageSales, setAverageSales] = useState(5680);
  const [newCustomers, setNewCustomers] = useState(5800);
  const [pendingOrders, setPendingOrders] = useState(580);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log(user , isAuthenticated) ;

  const canvasRef = useRef(null);
  const router = useRouter();

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if(!isAuthenticated)
      router.replace('/sign-in') ;
    else if(user.role != 'admin')
      router.replace('/customer/homepage')
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setOrdersReceived(Math.floor(Math.random() * 50) + 330);
      setAverageSales(Math.floor(Math.random() * 1000) + 5000);
      setNewCustomers(Math.floor(Math.random() * 200) + 5700);
      setPendingOrders(Math.floor(Math.random() * 100) + 550);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${
          Math.floor(Math.random() * 100) + 150
        }, ${Math.floor(Math.random() * 55) + 200}, ${
          Math.random() * 0.5 + 0.2
        })`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">
              EBAZER INITIALIZING
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active
                    link="/admin/dashboard"
                  />
                  <NavItem
                    icon={PackagePlus}
                    label="Add Products"
                    link="/admin/createProducts"
                  />
                  <NavItem
                    icon={PackageSearch}
                    label="View Products"
                    link="/admin/display-products"
                  />
                  <NavItem
                    icon={Tag}
                    label="Categories"
                    link="/admin/categories" // Assuming you’ll create this route
                  />
                  <NavItem
                    icon={ShoppingBag}
                    label="Orders"
                    link="/admin/sales/orders" // Add this route as needed
                  />
                  <NavItem
                    icon={Users}
                    label="Customers"
                    link="/admin/customers"
                  />
                  <NavItem icon={Star} label="Reviews" link="/admin/reviews" />
                  <NavItem icon={Tag} label="Inventory" link="/admin/sales/inventory" />
                  <NavItem icon={FileText} label="Pages" link="/admin/pages" />
                  <NavItem
                    icon={Settings}
                    label="Shop Settings"
                    link="/admin/settings"
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

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* Business overview */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
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
                        className="h-8 w-8 text-slate-400"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                      title="Orders Received"
                      value={ordersReceived}
                      icon={ShoppingBag}
                      trend="up"
                      color="cyan"
                      detail="10% increase"
                      unit=""
                    />
                    <MetricCard
                      title="Average Sales"
                      value={averageSales}
                      icon={DollarSign}
                      trend="up"
                      color="green"
                      detail="30% increase"
                      unit="$"
                    />
                    <MetricCard
                      title="New Customers"
                      value={Math.floor((newCustomers / 1000) * 10) / 10}
                      icon={Users}
                      trend="up"
                      color="purple"
                      detail="13% increase"
                      unit="K"
                    />
                    <MetricCard
                      title="Pending Orders"
                      value={pendingOrders}
                      icon={PackageSearch}
                      trend="stable"
                      color="blue"
                      detail="10% increase"
                      unit=""
                    />
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="sales" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="sales"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Sales Analytics
                          </TabsTrigger>
                          <TabsTrigger
                            value="categories"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Categories
                          </TabsTrigger>
                          <TabsTrigger
                            value="traffic"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Traffic Sources
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                            Sales
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            Visitors
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Orders
                          </div>
                        </div>
                      </div>

                      <TabsContent value="sales" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <SalesChart />
                          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                            <div className="text-xs text-slate-400">
                              Revenue Today
                            </div>
                            <div className="text-lg font-mono text-cyan-400">
                              ${averageSales.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="categories" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <div className="col-span-4">Category</div>
                            <div className="col-span-2">Products</div>
                            <div className="col-span-2">Sales</div>
                            <div className="col-span-2">Revenue</div>
                            <div className="col-span-2">Growth</div>
                          </div>

                          <div className="divide-y divide-slate-700/30">
                            <CategoryRow
                              category="Grocery"
                              products="1,245"
                              sales="2,845"
                              revenue="$45,680"
                              growth={12.5}
                            />
                            <CategoryRow
                              category="Men's Products"
                              products="856"
                              sales="1,923"
                              revenue="$32,450"
                              growth={8.3}
                            />
                            <CategoryRow
                              category="Women's Products"
                              products="1,034"
                              sales="2,156"
                              revenue="$38,920"
                              growth={15.7}
                            />
                            <CategoryRow
                              category="Kids Products"
                              products="567"
                              sales="892"
                              revenue="$18,340"
                              growth={6.2}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="traffic" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TrafficSource
                              name="Facebook"
                              visitors={15420}
                              percentage={35}
                            />
                            <TrafficSource
                              name="YouTube"
                              visitors={8930}
                              percentage={22}
                            />
                            <TrafficSource
                              name="Instagram"
                              visitors={7650}
                              percentage={18}
                            />
                            <TrafficSource
                              name="WhatsApp"
                              visitors={4230}
                              percentage={12}
                            />
                            <TrafficSource
                              name="Direct"
                              visitors={3890}
                              percentage={9}
                            />
                            <TrafficSource
                              name="Others"
                              visitors={1680}
                              percentage={4}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions & Orders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
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

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
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
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
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
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <Button
                      size="icon"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* Store time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">
                        STORE TIME
                      </div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">
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
                          Store Uptime
                        </div>
                        <div className="text-sm font-mono text-slate-200">
                          99.8%
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">
                          Time Zone
                        </div>
                        <div className="text-sm font-mono text-slate-200">
                          EST
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={PackagePlus} label="Add Product" />
                    <ActionButton icon={ShoppingBag} label="View Orders" />
                    <ActionButton icon={Users} label="Customers" />
                    <ActionButton icon={Star} label="Reviews" />
                  </div>
                </CardContent>
              </Card>

              {/* Sales allocation */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">
                    Sales Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <div className="text-xs text-blue-400">7% of total</div>
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
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">
                    Store Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
  );
}

// Component for nav items
function NavItem({ icon: Icon, label, active, link }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(link)}
      variant="ghost"
      className={`w-full justify-start ${
        active
          ? "bg-slate-800/70 text-cyan-400"
          : "text-slate-400 hover:text-slate-100"
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
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

// Component for metric cards
function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  unit = "",
}) {
  const getColor = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500 border-cyan-500/30";
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30";
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30";
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30";
      default:
        return "from-cyan-500 to-blue-500 border-cyan-500/30";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />;
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {unit}
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit === "K" ? "K" : ""}
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">
        {getTrendIcon()}
      </div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
    </div>
  );
}

// Sales chart component
function SalesChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">$10K</div>
        <div className="text-xs text-slate-500">$7.5K</div>
        <div className="text-xs text-slate-500">$5K</div>
        <div className="text-xs text-slate-500">$2.5K</div>
        <div className="text-xs text-slate-500">$0</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 12 }).map((_, i) => {
          const salesHeight = Math.floor(Math.random() * 70) + 20;
          const visitorsHeight = Math.floor(Math.random() * 50) + 30;
          const ordersHeight = Math.floor(Math.random() * 40) + 25;

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-2 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${salesHeight}%` }}
              ></div>
              <div
                className="w-2 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${visitorsHeight}%` }}
              ></div>
              <div
                className="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${ordersHeight}%` }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">Jan</div>
        <div className="text-xs text-slate-500">Mar</div>
        <div className="text-xs text-slate-500">May</div>
        <div className="text-xs text-slate-500">Jul</div>
        <div className="text-xs text-slate-500">Sep</div>
        <div className="text-xs text-slate-500">Nov</div>
      </div>
    </div>
  );
}

// Category row component
function CategoryRow({ category, products, sales, revenue, growth }) {
  return (
    <div className="grid grid-cols-12 items-center text-xs text-slate-300 px-3 py-3 hover:bg-slate-800/30">
      <div className="col-span-4 flex items-center">
        <div className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></div>
        {category}
      </div>
      <div className="col-span-2">{products}</div>
      <div className="col-span-2">{sales}</div>
      <div className="col-span-2 font-semibold text-green-400">{revenue}</div>
      <div className="col-span-2">
        <Badge
          variant="outline"
          className={`${
            growth > 10
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : growth > 5
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
              : "bg-red-500/10 text-red-400 border-red-500/30"
          } text-xs`}
        >
          +{growth}%
        </Badge>
      </div>
    </div>
  );
}

// Traffic source component
function TrafficSource({ name, visitors, percentage }) {
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

// Transaction item component
function TransactionItem({ customer, amount, time, status }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-md border border-slate-700/30">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-slate-700 text-cyan-500">
            {customer
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium text-slate-200">{customer}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-green-400">
          ${amount.toFixed(2)}
        </div>
        <Badge
          variant="outline"
          className={`text-xs ${
            status === "completed"
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
          }`}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}

// Alert item component (same as before)
function AlertItem({ title, time, description, type }) {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return {
          icon: AlertCircle,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
        };
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-500 bg-red-500/10 border-red-500/30",
        };
      case "update":
        return {
          icon: RefreshCw,
          color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
        };
      case "success":
        return {
          icon: Shield,
          color: "text-green-500 bg-green-500/10 border-green-500/30",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
        };
    }
  };

  const { icon: Icon, color } = getTypeStyles();

  return (
    <div className="flex items-start space-x-3">
      <div
        className={`mt-0.5 p-1 rounded-full ${color.split(" ")[1]} ${
          color.split(" ")[2]
        }`}
      >
        <Icon className={`h-3 w-3 ${color.split(" ")[0]}`} />
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="ml-2 text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
    </div>
  );
}

// Communication item component (same as before)
function CommunicationItem({ sender, time, message, avatar, unread }) {
  return (
    <div
      className={`flex space-x-3 p-2 rounded-md ${
        unread ? "bg-slate-800/50 border border-slate-700/50" : ""
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">
          {sender.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400">{message}</div>
      </div>
      {unread && (
        <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
      )}
    </div>
  );
}

// Action button component
function ActionButton({ icon: Icon, label }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </Button>
  );
}
