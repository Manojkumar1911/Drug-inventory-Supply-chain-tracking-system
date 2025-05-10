
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

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      // Auth context already shows the toast error
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl mx-auto overflow-hidden border-0 shadow-xl rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side: Illustration */}
          <div className="relative hidden md:block bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png')] bg-center bg-no-repeat bg-contain opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-purple-600/80"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-2">Manage your inventory the easiest way</h2>
              <p className="text-white/90 mb-6">
                Enjoy an easy to use inventory system for the management of your business products
              </p>
              
              <div className="mt-auto">
                <img src="/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png" alt="Illustration" className="w-3/4 h-auto mx-auto" />
              </div>
            </div>
          </div>
          
          {/* Right side: Login form */}
          <div className="p-8 bg-white dark:bg-gray-900 flex flex-col">
            <div className="mb-8 text-left">
              <h1 className="text-3xl font-bold tracking-tight text-purple-700 dark:text-purple-400">
                Hello,<br />Welcome Back!
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Sign in to access your pharmacy inventory
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email or username</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 pr-10"
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
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
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
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-purple-600 hover:underline dark:text-purple-400 font-medium">
                    Click here
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8">
              <div className="flex justify-center items-center gap-4">
                <img src="/lovable-uploads/21206511-7c47-44cf-893b-2a6de7d893fc.png" alt="App Store" className="h-8" />
                <img src="/lovable-uploads/21206511-7c47-44cf-893b-2a6de7d893fc.png" alt="Google Play" className="h-8" />
                <div className="flex items-center">
                  <span className="font-bold text-xl">Inven</span>
                  <span className="bg-yellow-400 text-black font-bold text-xl px-1 rounded">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
