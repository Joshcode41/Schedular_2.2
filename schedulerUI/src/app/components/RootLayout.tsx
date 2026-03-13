import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { 
  Calendar, 
  ClipboardList, 
  Users, 
  BarChart3, 
  Building2, 
  UserCircle, 
  LogOut,
  Home,
  MessageSquare,
  Settings,
  UserCog,
  CalendarDays
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { currentUser, setCurrentUser, users } from "../lib/mockData";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAuthPage = location.pathname === "/" || 
                     location.pathname === "/login" || 
                     location.pathname === "/register";

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleRoleSwitch = (role: "customer" | "technician" | "admin") => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      toast.success(`Switched to ${role} role`);
      navigate(`/${role}/dashboard`);
    }
  };

  const getNavItems = () => {
    if (currentUser.role === "customer") {
      return [
        { to: "/customer/dashboard", label: "Dashboard", icon: Home },
        { to: "/customer/book", label: "Book Appointment", icon: Calendar },
      ];
    } else if (currentUser.role === "technician") {
      return [
        { to: "/technician/dashboard", label: "My Assignments", icon: ClipboardList },
      ];
    } else if (currentUser.role === "admin") {
      return [
        { to: "/admin/dashboard", label: "Dashboard", icon: Home },
        { to: "/admin/calendar-management", label: "Calendar", icon: CalendarDays },
        { to: "/admin/customer-crm", label: "CRM", icon: UserCog },
        { to: "/admin/service-centres", label: "Service Centres", icon: Building2 },
        { to: "/admin/technician-assignment", label: "Assign Technicians", icon: Users },
        { to: "/admin/users", label: "User Management", icon: UserCircle },
        { to: "/admin/reports", label: "Reports", icon: BarChart3 },
      ];
    }
    return [];
  };

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Outlet />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              <span className="text-xl">AutoService Pro</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCircle className="w-5 h-5" />
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm">{currentUser.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{currentUser.role}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-sm">
                    {currentUser.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    {currentUser.phone}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("customer")}>
                    Switch to Customer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("technician")}>
                    Switch to Technician
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleSwitch("admin")}>
                    Switch to Admin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md whitespace-nowrap text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}