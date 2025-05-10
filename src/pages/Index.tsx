
import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '@/components/layout/LandingNav';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, ArrowRight } from "lucide-react";
import { ContainerScroll } from '@/components/ui/container-scroll';

// Import ThemeProvider
import { useTheme } from "@/context/ThemeContext";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  // Features list for the landing page
  const features = [
    "Real-time inventory tracking across multiple locations",
    "Smart reorder recommendations based on usage patterns",
    "Automated expiry date monitoring and alerts",
    "AI-powered inventory insights and reporting",
    "Seamless transfer management between locations",
    "Comprehensive analytics dashboard"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950/30 dark:to-purple-950/30">
      <LandingNav />
      
      <main className="container mx-auto px-4">
        <section className="flex flex-col lg:flex-row items-center gap-12 py-24">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
              Next-Gen Pharmacy Inventory Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Streamline your pharmacy operations with our AI-powered inventory system. Reduce waste, prevent stockouts, and optimize your supply chain.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-2">
                <Link to="/login">
                  {isAuthenticated ? "View Account" : "Sign In"}
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20 -z-10 rounded-3xl"></div>
          
          <ContainerScroll>
            <img 
              src={theme === 'dark' 
                ? "/lovable-uploads/62e8e4c7-dd8f-422f-b652-1fbc319f4492.png" 
                : "/lovable-uploads/a88f661a-2129-404c-ae3d-11efedd9536c.png"} 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover object-center"
            />
          </ContainerScroll>
        </section>
        
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 -z-10 rounded-3xl"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Why PharmaLink?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is designed specifically for pharmacies, with features that address the unique challenges of pharmaceutical inventory management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow hover:border-indigo-200 dark:hover:border-indigo-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                  <p className="text-lg">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10 rounded-3xl"></div>
          
          <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
            <div className="md:flex">
              <div className="md:flex-1 p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">AI-Powered Features</div>
                <h2 className="mt-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Inventory Management</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Our advanced AI features help you optimize stock levels, predict demand, identify trends, and get actionable insights from your inventory data.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Smart stock level predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>AI-generated inventory reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Intelligent chatbot for queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Product expiration monitoring</span>
                  </li>
                </ul>
              </div>
              <div className="md:flex-1 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="h-32 w-32 bg-white dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                  <p className="text-indigo-800 dark:text-indigo-200">Get answers about your inventory, generate reports, and receive intelligent recommendations.</p>
                  <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                    <Link to={isAuthenticated ? "/ai-features" : "/signup"}>
                      Try AI Features <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10 rounded-3xl"></div>
          
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Ready to optimize your pharmacy inventory?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join pharmacies around the world who trust our platform to manage their inventory efficiently.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl">
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </section>
      </main>
      
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">PharmaLink</h3>
              <p className="text-gray-600 dark:text-gray-300">Smart inventory management for pharmacies</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Features</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Pricing</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">API</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">About</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Contact</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PharmaLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
