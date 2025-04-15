
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileBox, Activity, Package, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNav from "@/components/layout/LandingNav";

const Index = () => {
  return (
    <div className="min-h-screen font-['Montserrat'] bg-gradient-to-b from-background via-background to-pharma-950/5">
      <LandingNav />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-6 animate-fade-in">
            <FileBox className="h-12 w-12 text-primary" />
            <span className="text-4xl font-bold bg-gradient-to-r from-primary via-pharma-600 to-pharma-800 bg-clip-text text-transparent">
              PharmaLink
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-pharma-500 to-pharma-700 bg-clip-text text-transparent">
              Pharmaceutical Inventory
            </span>
            <br />
            <span className="bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-8 animate-fade-in leading-relaxed">
            A complete solution for managing pharmaceutical inventory, transfers, and supply chain operations.
          </p>
          <Link to="/dashboard" className="animate-fade-in">
            <Button size="lg" className="bg-gradient-to-r from-pharma-600 to-pharma-800 hover:from-pharma-700 hover:to-pharma-900 text-white font-medium px-8 py-6 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="group bg-background/50 backdrop-blur-sm rounded-xl border p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              Inventory Management
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Track medication stock levels, monitor expiration dates, and manage batch numbers across locations.
            </p>
          </div>
          
          <div className="group bg-background/50 backdrop-blur-sm rounded-xl border p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              Transfer System
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Manage medication transfers between locations with approval workflows and tracking.
            </p>
          </div>
          
          <div className="group bg-background/50 backdrop-blur-sm rounded-xl border p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
              Alert System
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Receive alerts for low stock, approaching expiration dates, and other critical inventory issues.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center mt-16">
          <div className="w-full max-w-3xl p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Ready to optimize your pharmaceutical inventory?
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Join hundreds of pharmacies using PharmaLink to streamline their operations.
            </p>
            <div className="flex justify-center">
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="bg-background/50 backdrop-blur-sm font-medium">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
