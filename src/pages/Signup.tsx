
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

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signup, isAuthenticated } = useAuth();
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
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms of service");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      await signup(name, email, password);
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup failed", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (pageLoading) {
    return <PageLoader message="Loading sign up..." />;
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
            <div className="relative hidden md:block p-0">
              <img 
                src="/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png" 
                alt="Inventory Management" 
                className="w-full h-full object-cover mix-blend-normal"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            
            {/* Right side: Signup form */}
            <div className="p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-900 flex flex-col">
              <div className="mb-6 text-left">
                <motion.h1 
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Create an Account
                </motion.h1>
                <motion.p 
                  className="mt-2 text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Sign up to start managing your pharmacy inventory
                </motion.p>
              </div>
              
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-4 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Create password"
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 pr-10 transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={toggleShowConfirmPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-purple-600 hover:underline dark:text-purple-400">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-purple-600 hover:underline dark:text-purple-400">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md font-medium transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-600 hover:underline dark:text-purple-400 font-medium">
                      Login
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

export default Signup;
