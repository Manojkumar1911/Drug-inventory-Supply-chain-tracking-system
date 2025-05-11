
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/ThemeContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Building2, 
  Map, 
  FileBarChart, 
  LogOut, 
  Moon, 
  Sun, 
  Pill, 
  AlertTriangle, 
  Truck, 
  FileText, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, closeMobileMenu }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSignOut = () => {
    if (signOut) {
      signOut();
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />
    },
    {
      title: "Products",
      href: "/products",
      icon: <Pill className="h-5 w-5" />
    },
    {
      title: "Orders",
      href: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: "Purchase Orders",
      href: "/purchase-orders",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Suppliers",
      href: "/suppliers",
      icon: <Truck className="h-5 w-5" />
    },
    {
      title: "Locations",
      href: "/locations",
      icon: <Map className="h-5 w-5" />
    },
    {
      title: "Users",
      href: "/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileBarChart className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Alerts",
      href: "/alerts",
      icon: <AlertTriangle className="h-5 w-5" />
    }
  ];

  return (
    <div className={cn(
      "flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/80 border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-14 items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 px-4">
        {!collapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
            onClick={handleLinkClick}
          >
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">PharmaLink</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex w-full justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleLinkClick}
              className={cn(
                isActive(item.href) 
                  ? "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all bg-gradient-to-r from-primary/10 to-primary/5 text-primary" 
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-gradient-to-r hover:from-slate-200/50 hover:to-slate-100/50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50",
                collapsed && "justify-center px-2"
              )}
            >
              {item.icon}
              {!collapsed && item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link
              to="/settings"
              onClick={handleLinkClick}
              className={cn(
                isActive("/settings") 
                  ? "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all bg-gradient-to-r from-primary/10 to-primary/5 text-primary" 
                  : "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-gradient-to-r hover:from-slate-200/50 hover:to-slate-100/50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50"
              )}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
        <div className={cn(
          "mt-4 flex items-center gap-2 rounded-lg border border-border p-2",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name || user?.email || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.role || 'Staff'}</p>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
