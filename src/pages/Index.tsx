
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileBox, Activity, Package, Bell, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";

const Index = () => {
  return (
    <div className="min-h-screen font-['Playfair_Display'] bg-gradient-to-b from-background via-background to-pharma-950/5">
      <LandingNav />
      
      {/* Hero Section with 3D Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pharma-600/20 to-pharma-800/20 backdrop-blur-3xl z-0" />
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-2 mb-6 animate-fade-in transform hover:scale-110 transition-transform duration-300">
              <FileBox className="h-12 w-12 text-primary animate-pulse" />
              <span className="text-5xl font-bold bg-gradient-to-r from-primary via-pharma-600 to-pharma-800 bg-clip-text text-transparent">
                PharmaLink
              </span>
            </div>
            <h1 className="text-7xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-pharma-500 to-pharma-700 bg-clip-text text-transparent">
                Next-Gen Pharma
              </span>
              <br />
              <span className="bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
                Inventory System
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mb-8 animate-fade-in leading-relaxed font-['Montserrat']">
              Transform your pharmaceutical inventory management with our cutting-edge solution.
            </p>
            <Link to="/dashboard" className="animate-fade-in transform hover:scale-105 transition-all duration-300">
              <Button size="lg" className="bg-gradient-to-r from-pharma-600 to-pharma-800 hover:from-pharma-700 hover:to-pharma-900 text-white font-medium px-8 py-6 text-lg shadow-lg hover:shadow-xl">
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* 3D Feature Cards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {[
              {
                icon: Package,
                title: "Smart Inventory",
                description: "AI-powered inventory tracking and management system",
                gradient: "from-blue-500/10 to-blue-600/10"
              },
              {
                icon: Activity,
                title: "Real-time Analytics",
                description: "Live monitoring and predictive analytics",
                gradient: "from-purple-500/10 to-purple-600/10"
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                description: "Smart notifications for critical inventory events",
                gradient: "from-pink-500/10 to-pink-600/10"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-gradient-to-br ${feature.gradient} backdrop-blur-lg rounded-xl border border-white/10 p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/5`}
              >
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed font-['Montserrat']">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { number: "99.9%", label: "Accuracy Rate" },
              { number: "24/7", label: "Monitoring" },
              { number: "1000+", label: "Active Users" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-pharma-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-['Montserrat']">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center mt-16">
            <div className="w-full max-w-4xl p-12 rounded-2xl bg-gradient-to-br from-pharma-600/10 via-pharma-700/5 to-transparent border border-white/10 backdrop-blur-md">
              <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Ready to Transform Your Inventory Management?
              </h2>
              <p className="text-center text-muted-foreground mb-8 font-['Montserrat'] max-w-2xl mx-auto">
                Join hundreds of pharmacies already using PharmaLink to streamline their operations and improve efficiency.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/login">
                  <Button variant="outline" size="lg" className="bg-white/5 backdrop-blur-sm font-medium border-white/10 hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-pharma-600 to-pharma-800 hover:from-pharma-700 hover:to-pharma-900 text-white font-medium">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
