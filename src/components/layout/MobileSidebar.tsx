
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";

interface MobileSidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const MobileSidebarLink: React.FC<MobileSidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  active,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
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

interface MobileSidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const MobileSidebarSection: React.FC<MobileSidebarSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="py-2">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 sm:max-w-xs">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold" onClick={onClose}>
              <FileBox className="h-6 w-6 text-pharma-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
                PharmaLink
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm">
            <MobileSidebarSection title="Overview">
              <MobileSidebarLink
                to="/dashboard"
                icon={Home}
                label="Dashboard"
                active={location.pathname === "/dashboard"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/analytics"
                icon={BarChart3}
                label="Analytics"
                active={location.pathname === "/analytics"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/alerts"
                icon={AlertCircle}
                label="Alerts"
                active={location.pathname === "/alerts"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="Inventory">
              <MobileSidebarLink
                to="/products"
                icon={PackageOpen}
                label="Products"
                active={location.pathname === "/products"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/transfers"
                icon={RefreshCcw}
                label="Transfers"
                active={location.pathname === "/transfers"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/reorder"
                icon={PlusCircle}
                label="Reorder"
                active={location.pathname === "/reorder"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="Management">
              <MobileSidebarLink
                to="/locations"
                icon={Map}
                label="Locations"
                active={location.pathname === "/locations"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/suppliers"
                icon={Truck}
                label="Suppliers"
                active={location.pathname === "/suppliers"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/users"
                icon={Users}
                label="Users"
                active={location.pathname === "/users"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="System">
              <MobileSidebarLink
                to="/settings"
                icon={Settings}
                label="Settings"
                active={location.pathname === "/settings"}
                onClick={onClose}
              />
            </MobileSidebarSection>
          </nav>
        </div>
        
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-2 rounded-md bg-pharma-50 p-2 dark:bg-pharma-900/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pharma-100 text-pharma-600">
              <span className="text-xs font-semibold">
                {user?.name?.substring(0, 2) || 'JD'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium">{user?.name || "John Doe"}</p>
              <p className="text-xs text-muted-foreground">{user?.role || "Administrator"}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
