
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileBox, Shield, Sparkles, BarChart4, Package, Bell, Boxes, Brain, Bot, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";

const Index = () => {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-background to-background/90">
      <LandingNav />
      
      {/* Hero Section with 3D Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pharma-600/10 to-pharma-800/10 backdrop-blur-3xl z-0" />
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <FileBox className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  PharmaLink
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Streamline your pharmacy
                </span>
                <br />
                <span className="text-foreground">
                  inventory with AI
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                We're revolutionizing the way you handle pharmacy management and logistics. 
                Say goodbye to complexities of inventory tracking and hello to efficiency, accuracy, and cost savings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl">
                    Get started for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="bg-white/5 backdrop-blur-sm font-medium border-white/10 hover:bg-white/10 px-8 py-6 text-lg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="rounded-xl overflow-hidden shadow-2xl transform rotate-1 border border-gray-200 dark:border-gray-800">
                <img 
                  src="/lovable-uploads/21206511-7c47-44cf-893b-2a6de7d893fc.png" 
                  alt="PharmaLink Dashboard" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 mt-20">
            {[
              { number: "99.9%", label: "Inventory Accuracy" },
              { number: "60%", label: "Time Saved" },
              { number: "24/7", label: "Monitoring" },
              { number: "1000+", label: "Active Pharmacies" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Features Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Designed for modern pharmacies
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive set of features helps you manage your inventory with ease
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Package,
                  title: "Smart Inventory",
                  description: "AI-powered inventory tracking and management system with automated reordering suggestions"
                },
                {
                  icon: BarChart4,
                  title: "Real-time Analytics",
                  description: "Live monitoring and predictive analytics to optimize your stock levels and reduce waste"
                },
                {
                  icon: Bell,
                  title: "Instant Alerts",
                  description: "Receive notifications for low stock, expiring products, and transfer opportunities"
                },
                {
                  icon: Shield,
                  title: "Secure Data",
                  description: "Enterprise-grade security ensures your inventory data is always protected"
                },
                {
                  icon: Brain,
                  title: "AI Smart Reports",
                  description: "Intelligent reporting that provides actionable insights based on your inventory data"
                },
                {
                  icon: Bot,
                  title: "AI Assistant",
                  description: "Get instant answers to your questions with our smart AI chatbot assistant"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* How It Works Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How PharmaLink works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started in minutes and transform your pharmacy operations
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Create your account and set up your pharmacy profile in minutes"
                },
                {
                  step: "2",
                  title: "Import Inventory",
                  description: "Upload your existing inventory or add products manually with our easy interface"
                },
                {
                  step: "3",
                  title: "Start Managing",
                  description: "Begin tracking inventory, receiving alerts, and making data-driven decisions"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative p-8 rounded-xl border border-white/10"
                >
                  <div className="absolute -top-5 -left-5 bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by pharmacists
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our clients are saying about PharmaLink
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "PharmaLink has completely transformed how we manage our inventory. The AI features are incredibly helpful.",
                  name: "Sarah Johnson",
                  title: "Head Pharmacist, MediCare Plus"
                },
                {
                  quote: "The expiry alerts have saved us thousands of dollars in potential waste. This system pays for itself.",
                  name: "Michael Chang",
                  title: "Owner, Family Pharmacy"
                },
                {
                  quote: "I can't imagine going back to our old system. The analytics alone make PharmaLink worth every penny.",
                  name: "Priya Patel",
                  title: "Pharmacy Manager, HealthFirst"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-8 shadow-lg"
                >
                  <div className="mb-4 text-primary">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.039 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                    </svg>
                  </div>
                  <p className="mb-6 text-lg">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center mt-16">
            <div className="w-full max-w-5xl p-12 rounded-2xl bg-gradient-to-br from-blue-600/10 via-blue-700/5 to-transparent border border-white/10 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6">
                    Ready to transform your pharmacy management?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    Join thousands of pharmacists already using PharmaLink to streamline their operations and improve efficiency.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/signup">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="bg-white/5 backdrop-blur-sm font-medium border-white/10 hover:bg-white/10">
                        Book a Demo
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Free 30-day full-featured trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Easy setup - be running in minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Priority support for new accounts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <FileBox className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">
                  PharmaLink
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} PharmaLink. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
