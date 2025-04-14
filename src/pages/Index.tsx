
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileBox } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-6">
            <FileBox className="h-10 w-10 text-pharma-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">
              PharmaLink
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Pharmaceutical Inventory Management</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            A complete solution for managing pharmaceutical inventory, transfers, and supply chain operations.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-pharma-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-pharma-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Inventory Management</h2>
            <p className="text-gray-600">
              Track medication stock levels, monitor expiration dates, and manage batch numbers across locations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-pharma-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-pharma-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Transfer System</h2>
            <p className="text-gray-600">
              Manage medication transfers between locations with approval workflows and tracking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-12 w-12 rounded-full bg-pharma-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-pharma-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Alert System</h2>
            <p className="text-gray-600">
              Receive alerts for low stock, approaching expiration dates, and other critical inventory issues.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link to="/dashboard">
            <Button size="lg" className="bg-pharma-600 hover:bg-pharma-700 text-white">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
