
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
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
  FileBox
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => (
  <div className="space-y-1">
    <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground">{title}</h3>
    <ul className="space-y-1">{children}</ul>
  </div>
);

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, children }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-muted",
            isActive
              ? "bg-muted font-medium text-primary"
              : "text-muted-foreground"
          )
        }
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="px-3 py-4 flex items-center gap-2 border-b">
        <FileBox className="h-6 w-6 text-primary" />
        <span className="text-base font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          PharmaLink
        </span>
      </div>

      <div className="flex-1 px-2 py-4 overflow-auto">
        <div className="space-y-6">
          <SidebarSection title="Overview">
            <SidebarLink to="/dashboard" icon={Home}>Dashboard</SidebarLink>
            <SidebarLink to="/analytics" icon={LineChart}>Analytics</SidebarLink>
            <SidebarLink to="/alerts" icon={AlertTriangle}>Alerts</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Inventory">
            <SidebarLink to="/products" icon={Package}>Products</SidebarLink>
            <SidebarLink to="/transfers" icon={ArrowLeftRight}>Transfers</SidebarLink>
            <SidebarLink to="/reorder" icon={RefreshCcw}>Reorder</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Management">
            <SidebarLink to="/locations" icon={MapPin}>Locations</SidebarLink>
            <SidebarLink to="/suppliers" icon={Truck}>Suppliers</SidebarLink>
            <SidebarLink to="/purchase-orders" icon={ShoppingBag}>Purchase Orders</SidebarLink>
            <SidebarLink to="/users" icon={Users}>Users</SidebarLink>
          </SidebarSection>

          <SidebarSection title="Features">
            <SidebarLink to="/ai-features" icon={Sparkles}>AI Features</SidebarLink>
            <SidebarLink to="/settings" icon={Settings}>Settings</SidebarLink>
          </SidebarSection>
        </div>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.substring(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium line-clamp-1">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
