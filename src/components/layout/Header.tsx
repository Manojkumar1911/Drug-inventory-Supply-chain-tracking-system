
import React from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  FileBox, 
  MenuIcon, 
  Search,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={toggleSidebar}
      >
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="md:hidden flex items-center gap-2">
        <FileBox className="h-5 w-5 text-pharma-600" />
        <span className="text-base font-semibold bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
          PharmaLink
        </span>
      </div>

      <div className="flex w-full items-center gap-2 md:gap-4">
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 focus-visible:ring-pharma-500"
            />
          </div>
        </form>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/alerts">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                4
              </span>
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
