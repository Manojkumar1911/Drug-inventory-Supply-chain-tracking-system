
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import PageLoader from "@/components/ui/page-loader";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      toast.error("Please enter both email and password");
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (pageLoading) {
    return <PageLoader message="Loading login..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-5xl mx-auto overflow-hidden border-0 shadow-xl rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side: Illustration */}
            <div className="relative hidden md:block bg-gradient-to-br from-purple-600 to-indigo-700 p-0">
              <img 
                src="/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png" 
                alt="Inventory Management" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-indigo-700/90 mix-blend-multiply"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                <motion.h2 
                  className="text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  Welcome to PharmaLink
                </motion.h2>
                <motion.p
                  className="text-lg text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  The intelligent inventory management solution for pharmaceutical supply chains
                </motion.p>
              </div>
            </div>
            
            {/* Right side: Login form */}
            <div className="p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-900 flex flex-col">
              <div className="mb-8 text-left">
                <motion.h1 
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Welcome Back!
                </motion.h1>
                <motion.p 
                  className="mt-3 text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Sign in to access your pharmacy inventory
                </motion.p>
              </div>
              
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email or username</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 pr-10 transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md font-medium transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-purple-600 hover:underline dark:text-purple-400 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </motion.form>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
