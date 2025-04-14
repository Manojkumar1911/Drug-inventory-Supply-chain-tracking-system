
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
  activePath: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  activePath,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 sm:max-w-xs">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold" onClick={onClose}>
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
                to="/"
                icon={Home}
                label="Dashboard"
                active={activePath === "/"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/analytics"
                icon={BarChart3}
                label="Analytics"
                active={activePath === "/analytics"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/alerts"
                icon={AlertCircle}
                label="Alerts"
                active={activePath === "/alerts"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="Inventory">
              <MobileSidebarLink
                to="/products"
                icon={PackageOpen}
                label="Products"
                active={activePath === "/products"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/transfers"
                icon={RefreshCcw}
                label="Transfers"
                active={activePath === "/transfers"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/reorder"
                icon={PlusCircle}
                label="Reorder"
                active={activePath === "/reorder"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="Management">
              <MobileSidebarLink
                to="/locations"
                icon={Map}
                label="Locations"
                active={activePath === "/locations"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/suppliers"
                icon={Truck}
                label="Suppliers"
                active={activePath === "/suppliers"}
                onClick={onClose}
              />
              <MobileSidebarLink
                to="/users"
                icon={Users}
                label="Users"
                active={activePath === "/users"}
                onClick={onClose}
              />
            </MobileSidebarSection>
            
            <MobileSidebarSection title="System">
              <MobileSidebarLink
                to="/settings"
                icon={Settings}
                label="Settings"
                active={activePath === "/settings"}
                onClick={onClose}
              />
            </MobileSidebarSection>
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
