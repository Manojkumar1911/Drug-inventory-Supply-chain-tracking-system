
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Home,
  Package,
  ArrowLeftRight,
  AlertTriangle,
  LineChart,
  Settings,
  User,
  MapPin,
  Truck,
  ShoppingBag,
  Users,
  RefreshCcw,
  Sparkles,
  FileBox,
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children, isCollapsed }) => (
  <div className="space-y-1">
    {!isCollapsed && (
      <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">{title}</h3>
    )}
    <ul className="space-y-1">{children}</ul>
  </div>
);

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, children, isCollapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all hover:bg-background/80 dark:hover:bg-gray-800/60 relative overflow-hidden group",
            isActive
              ? "font-medium text-primary bg-background dark:bg-gray-900/70 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.2)]"
              : "text-muted-foreground"
          )
        }
      >
        {isActive && (
          <motion.span
            layoutId="sidebar-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-blue-600 rounded-r"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <div className={cn(
          "flex items-center transition-all",
          isCollapsed ? "justify-center w-full" : ""
        )}>
          <Icon className={cn(
            "h-5 w-5 transition-transform",
            isActive ? "text-primary" : "text-muted-foreground",
            "group-hover:scale-110 group-hover:text-primary duration-300"
          )} />
          {!isCollapsed && (
            <span className="ml-3">{children}</span>
          )}
        </div>
      </NavLink>
    </motion.li>
  );
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={cn(
        "px-3 py-4 flex items-center gap-2 border-b transition-all",
        isCollapsed ? "justify-center" : ""
      )}>
        <FileBox className="h-6 w-6 text-primary" />
        {!isCollapsed && (
          <span className="text-base font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            PharmaLink
          </span>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto h-7 w-7 rounded-full hover:bg-muted" 
            onClick={toggleCollapsed}
          >
            <ChevronLeft className={cn("h-4 w-4 text-muted-foreground transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <div className={cn("flex-1 px-2 py-4 overflow-auto", isCollapsed ? "px-1" : "")}>
        <div className="space-y-6">
          <SidebarSection title="Overview" isCollapsed={isCollapsed}>
            <SidebarLink to="/dashboard" icon={Home} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Dashboard</SidebarLink>
            <SidebarLink to="/analytics" icon={LineChart} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Analytics</SidebarLink>
            <SidebarLink to="/alerts" icon={AlertTriangle} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Alerts</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Inventory" isCollapsed={isCollapsed}>
            <SidebarLink to="/products" icon={Package} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Products</SidebarLink>
            <SidebarLink to="/transfers" icon={ArrowLeftRight} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Transfers</SidebarLink>
            <SidebarLink to="/reorder" icon={RefreshCcw} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Reorder</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Management" isCollapsed={isCollapsed}>
            <SidebarLink to="/locations" icon={MapPin} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Locations</SidebarLink>
            <SidebarLink to="/suppliers" icon={Truck} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Suppliers</SidebarLink>
            <SidebarLink to="/purchase-orders" icon={ShoppingBag} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Purchase Orders</SidebarLink>
            <SidebarLink to="/users" icon={Users} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Users</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Features" isCollapsed={isCollapsed}>
            <SidebarLink to="/ai-features" icon={Sparkles} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>AI Features</SidebarLink>
            <SidebarLink to="/settings" icon={Settings} isCollapsed={isCollapsed} onClick={() => isMobile && setIsMobileSidebarOpen(false)}>Settings</SidebarLink>
          </SidebarSection>
        </div>
      </div>

      <div className={cn(
        "mt-auto border-t p-4 transition-all",
        isCollapsed ? "p-2" : ""
      )}>
        {isCollapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full"
            onClick={() => setIsCollapsed(false)}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium line-clamp-1">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-40"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div 
      className={cn(
        "h-full border-r bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
