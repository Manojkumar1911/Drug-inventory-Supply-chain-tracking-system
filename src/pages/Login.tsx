
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-blue-950/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl mx-auto overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side: Login form */}
          <div className="p-8 md:p-10">
            <CardHeader className="p-0 mb-6 space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">
                Hello,
              </CardTitle>
              <CardTitle className="text-3xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">
                Welcome Back!
              </CardTitle>
              <CardDescription className="mt-3 text-gray-600 dark:text-gray-400">
                Sign in to access your pharmacy inventory
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email or username</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
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
                      className="h-12 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 pr-10"
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
                
                <div className="flex items-center justify-between">
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
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
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
                    <span className="flex items-center justify-center gap-2">
                      Login
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center p-0 pt-6">
              <div className="text-sm text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                  Click here
                </Link>
              </div>
            </CardFooter>

            <div className="flex justify-center space-x-4 mt-8">
              <img src="/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png" alt="Illustration" className="w-24 h-auto opacity-70" />
            </div>
          </div>
          
          {/* Right side: Illustration */}
          <div className="relative hidden md:block bg-gradient-to-br from-indigo-500 to-purple-600 p-10">
            <div className="absolute inset-0 bg-[url('/lovable-uploads/8d06bee3-12a7-43a3-93bc-a3f0bf605872.png')] bg-center bg-no-repeat bg-contain opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-purple-600/80"></div>
            
            <div className="relative z-10 text-white mt-auto h-full flex flex-col justify-end">
              <h3 className="text-2xl font-bold mb-2">Manage your inventory the easiest way</h3>
              <p className="text-white/90">
                Enjoy an easy to use inventory system for the management of your business products
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
