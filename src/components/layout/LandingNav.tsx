
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileBox } from "lucide-react";

const LandingNav = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FileBox className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary via-pharma-600 to-pharma-800 bg-clip-text text-transparent">
            PharmaLink
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" className="font-medium">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-pharma-600 to-pharma-800 hover:from-pharma-700 hover:to-pharma-900 text-white font-medium">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
