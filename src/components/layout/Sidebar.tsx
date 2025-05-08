import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  Sparkles
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col gap-4 py-4", className)}>
      <li>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Package className="h-4 w-4" />
          <span>Products</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/transfers"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Transfers</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Alerts</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/reorder"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Reorder</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/locations"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <MapPin className="h-4 w-4" />
          <span>Locations</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Truck className="h-4 w-4" />
          <span>Suppliers</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/purchase-orders"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Purchase Orders</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Users className="h-4 w-4" />
          <span>Users</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <LineChart className="h-4 w-4" />
          <span>Analytics</span>
        </NavLink>
      </li>
      
      <li>
        <NavLink
          to="/ai-features"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Features</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-primary",
              isActive
                ? "bg-muted font-medium text-primary"
                : "text-muted-foreground"
            )
          }
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </NavLink>
      </li>
    </div>
  );
};

export default Sidebar;
