
import React from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '@/components/layout/LandingNav';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from "lucide-react";
import { ContainerScroll } from '@/components/ui/container-scroll';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-background dark:to-background/90">
      <LandingNav />
      
      <main className="container mx-auto px-4 pt-20 pb-16">
        <section className="flex flex-col lg:flex-row items-center gap-12 py-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Next-Gen Pharmacy Inventory Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Streamline your pharmacy operations with our AI-powered inventory system. Reduce waste, prevent stockouts, and optimize your supply chain.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">
                  {isAuthenticated ? "View Account" : "Sign In"}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <ContainerScroll>
              <img 
                src="/lovable-uploads/62e8e4c7-dd8f-422f-b652-1fbc319f4492.png" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover"
              />
            </ContainerScroll>
          </div>
        </section>
        
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Why PharmaLink?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is designed specifically for pharmacies, with features that address the unique challenges of pharmaceutical inventory management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow hover:border-blue-200 dark:hover:border-blue-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-lg">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="py-16">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
            <div className="md:flex">
              <div className="md:flex-1 p-8">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">AI-Powered Features</div>
                <h2 className="mt-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Smart Inventory Management</h2>
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
              <div className="md:flex-1 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="h-32 w-32 bg-white dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                  <p className="text-blue-800 dark:text-blue-200">Get answers about your inventory, generate reports, and receive intelligent recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ready to optimize your pharmacy inventory?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join pharmacies around the world who trust our platform to manage their inventory efficiently.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </section>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PharmaLink</h3>
              <p className="text-gray-600 dark:text-gray-300">Smart inventory management for pharmacies</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Features</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Pricing</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">API</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">About</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Contact</Link></li>
                  <li><Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Privacy</Link></li>
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
