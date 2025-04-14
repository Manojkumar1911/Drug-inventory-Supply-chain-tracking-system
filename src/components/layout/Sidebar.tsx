
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BarChart3,
  FileBox,
  Home,
  Map,
  PackageOpen,
  PlusCircle,
  RefreshCcw,
  Settings,
  Truck,
  Users,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  active,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-pharma-100 dark:hover:bg-pharma-950/50",
        active && "bg-pharma-100 font-medium text-pharma-900 dark:bg-pharma-950/50 dark:text-pharma-100"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="py-2">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

interface SidebarProps {
  activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <FileBox className="h-6 w-6 text-pharma-600" />
          <span className="text-lg font-bold bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
            PharmaLink
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          <SidebarSection title="Overview">
            <SidebarLink
              to="/"
              icon={Home}
              label="Dashboard"
              active={activePath === "/"}
            />
            <SidebarLink
              to="/analytics"
              icon={BarChart3}
              label="Analytics"
              active={activePath === "/analytics"}
            />
            <SidebarLink
              to="/alerts"
              icon={AlertCircle}
              label="Alerts"
              active={activePath === "/alerts"}
            />
          </SidebarSection>
          
          <SidebarSection title="Inventory">
            <SidebarLink
              to="/products"
              icon={PackageOpen}
              label="Products"
              active={activePath === "/products"}
            />
            <SidebarLink
              to="/transfers"
              icon={RefreshCcw}
              label="Transfers"
              active={activePath === "/transfers"}
            />
            <SidebarLink
              to="/reorder"
              icon={PlusCircle}
              label="Reorder"
              active={activePath === "/reorder"}
            />
          </SidebarSection>
          
          <SidebarSection title="Management">
            <SidebarLink
              to="/locations"
              icon={Map}
              label="Locations"
              active={activePath === "/locations"}
            />
            <SidebarLink
              to="/suppliers"
              icon={Truck}
              label="Suppliers"
              active={activePath === "/suppliers"}
            />
            <SidebarLink
              to="/users"
              icon={Users}
              label="Users"
              active={activePath === "/users"}
            />
          </SidebarSection>
          
          <SidebarSection title="System">
            <SidebarLink
              to="/settings"
              icon={Settings}
              label="Settings"
              active={activePath === "/settings"}
            />
          </SidebarSection>
        </nav>
      </div>
      
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2 rounded-md bg-pharma-50 p-2 dark:bg-pharma-900/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pharma-100 text-pharma-600">
            <span className="text-xs font-semibold">JD</span>
          </div>
          <div>
            <p className="text-xs font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
