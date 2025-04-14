
import React from "react";
import { 
  AlertCircle, 
  BarChart3, 
  Calendar, 
  Clock, 
  Package, 
  PackagePlus, 
  Pill, 
  RefreshCcw, 
  ShieldAlert 
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import AlertCard, { AlertItem } from "@/components/dashboard/AlertCard";
import InventoryLevelCard, { InventoryItem } from "@/components/dashboard/InventoryLevelCard";
import TransferCard, { Transfer } from "@/components/dashboard/TransferCard";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockAlerts: AlertItem[] = [
  {
    id: "1",
    title: "Low stock: Amoxicillin 500mg",
    description: "Current stock is below minimum threshold. Please restock soon.",
    priority: "high",
    location: "Main Pharmacy",
    createdAt: "2h ago",
  },
  {
    id: "2",
    title: "Expiring soon: Insulin Glargine",
    description: "30 units will expire within 30 days.",
    priority: "medium",
    location: "Cold Storage A",
    createdAt: "5h ago",
  },
  {
    id: "3",
    title: "Temperature excursion: Cold Storage B",
    description: "Temperature reached 10°C (above threshold of 8°C) for 15 minutes.",
    priority: "critical",
    location: "Cold Storage B",
    createdAt: "10m ago",
  },
  {
    id: "4",
    title: "Delivery scheduled: Order #5789",
    description: "Supply delivery from PharmaCorp scheduled for tomorrow at 10:00 AM.",
    priority: "low",
    location: "Receiving Bay 2",
    createdAt: "1d ago",
  },
];

const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Amoxicillin 500mg",
    currentStock: 120,
    minimumStock: 150,
    maximumStock: 500,
    isLowStock: true,
    expiringWithin30Days: false,
    unit: "boxes"
  },
  {
    id: "2",
    name: "Insulin Glargine 100mL",
    currentStock: 85,
    minimumStock: 50,
    maximumStock: 200,
    isLowStock: false,
    expiringWithin30Days: true,
    unit: "vials"
  },
  {
    id: "3",
    name: "Ibuprofen 200mg",
    currentStock: 320,
    minimumStock: 100,
    maximumStock: 400,
    isLowStock: false,
    expiringWithin30Days: false,
    unit: "bottles"
  },
  {
    id: "4",
    name: "Lisinopril 10mg",
    currentStock: 45,
    minimumStock: 50,
    maximumStock: 200,
    isLowStock: true,
    expiringWithin30Days: false,
    unit: "packs"
  },
];

const mockTransfers: Transfer[] = [
  {
    id: "T-1001",
    productName: "Amoxicillin 500mg",
    quantity: 50,
    unit: "boxes",
    sourceLocation: "Distribution Center",
    destinationLocation: "Main Pharmacy",
    status: "in-transit",
    requestDate: "Apr 12, 2025",
    estimatedDelivery: "Apr 14, 2025"
  },
  {
    id: "T-1002",
    productName: "Insulin Glargine",
    quantity: 20,
    unit: "vials",
    sourceLocation: "Main Pharmacy",
    destinationLocation: "North Branch",
    status: "pending",
    requestDate: "Apr 13, 2025"
  },
  {
    id: "T-1003",
    productName: "Metformin 1000mg",
    quantity: 30,
    unit: "bottles",
    sourceLocation: "Supplier Direct",
    destinationLocation: "Main Pharmacy",
    status: "completed",
    requestDate: "Apr 10, 2025",
    estimatedDelivery: "Apr 11, 2025"
  },
];

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your pharmaceutical inventory system</p>
        </div>

        {/* Stats row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Products"
            value="487"
            icon={Package}
            trend={{ value: 4.5, isPositive: true }}
          />
          <StatCard 
            title="Low Stock Items"
            value="24"
            icon={ShieldAlert}
            description="Items below minimum threshold"
            trend={{ value: 12.2, isPositive: false }}
          />
          <StatCard 
            title="Expiring Soon"
            value="32"
            icon={Calendar}
            description="Items expiring within 30 days"
            trend={{ value: 8.1, isPositive: false }}
          />
          <StatCard 
            title="Active Transfers"
            value="15"
            icon={RefreshCcw}
            description="Pending and in-transit"
            trend={{ value: 2.3, isPositive: true }}
          />
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-6">
          {/* Alerts section */}
          <Card className="md:col-span-6 lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alerts & Notifications</CardTitle>
                  <CardDescription>Recent system alerts</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </CardContent>
          </Card>

          {/* Main tabs section */}
          <div className="md:col-span-6 lg:col-span-4">
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  <span>Inventory Status</span>
                </TabsTrigger>
                <TabsTrigger value="transfers" className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  <span>Recent Transfers</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Inventory tab content */}
              <TabsContent value="inventory" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Critical Inventory Levels</CardTitle>
                        <CardDescription>Monitor low stock and expiring items</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All Products
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {mockInventoryItems.map(item => (
                        <InventoryLevelCard key={item.id} item={item} />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule Recount
                      </Button>
                      <Button size="sm">
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Add New Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Transfers tab content */}
              <TabsContent value="transfers" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Transfers</CardTitle>
                        <CardDescription>Track inventory movement between locations</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        New Transfer
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockTransfers.map(transfer => (
                        <TransferCard key={transfer.id} transfer={transfer} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Analytics tab content */}
              <TabsContent value="analytics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>Key performance metrics for your inventory</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        Analytics data will be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
