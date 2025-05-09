
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileBox, Menu, X } from "lucide-react";

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FileBox className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary via-blue-500 to-blue-700 bg-clip-text text-transparent">
            PharmaLink
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Features
              </Link>
            </li>
            <li>
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Contact
              </Link>
            </li>
          </ul>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="font-medium">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              <li>
                <Link 
                  to="/" 
                  className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
