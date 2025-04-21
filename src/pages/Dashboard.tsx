
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BarChart3, Package, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

// Sample dashboard data with more entries
const dashboardData = {
  stats: [
    {
      title: "Total Inventory",
      value: "3,248",
      change: "+15.2%",
      trend: "up",
      description: "From last month"
    },
    {
      title: "Critical Items",
      value: "32",
      change: "-3.2%",
      trend: "down",
      description: "From last week"
    },
    {
      title: "Expiring Soon",
      value: "156",
      change: "+28.4%",
      trend: "up",
      description: "Within 90 days"
    },
    {
      title: "Pending Transfers",
      value: "21",
      change: "+5.3%",
      trend: "up",
      description: "Awaiting approval"
    }
  ],
  recentAlerts: [
    {
      title: "Low Stock Alert",
      description: "Amoxicillin 500mg is below minimum threshold",
      severity: "high",
      timestamp: "10 minutes ago"
    },
    {
      title: "Expiration Warning",
      description: "Insulin Glargine 100mL expires in 30 days",
      severity: "medium",
      timestamp: "2 hours ago"
    },
    {
      title: "Transfer Request",
      description: "Boston Branch requested Lisinopril 10mg (45 units)",
      severity: "low",
      timestamp: "Yesterday"
    },
    {
      title: "Stock Discrepancy",
      description: "Metformin 1000mg count mismatch detected",
      severity: "high",
      timestamp: "3 hours ago"
    },
    {
      title: "Temperature Alert",
      description: "Cold storage #2 temperature above threshold",
      severity: "high",
      timestamp: "1 hour ago"
    }
  ],
  inventoryLevels: [
    { category: "Antibiotics", current: 458, target: 500 },
    { category: "Cardiovascular", current: 623, target: 600 },
    { category: "Diabetes", current: 317, target: 350 },
    { category: "Pain Relief", current: 542, target: 450 },
    { category: "Respiratory", current: 284, target: 300 },
    { category: "Allergy", current: 189, target: 200 }
  ],
  recentTransfers: [
    {
      id: "T-2409",
      product: "Fluticasone Propionate",
      quantity: 75,
      from: "Main Warehouse",
      to: "South Branch",
      status: "Completed",
      date: "Apr 20, 2025"
    },
    {
      id: "T-2408",
      product: "Lisinopril 20mg",
      quantity: 120,
      from: "West Branch",
      to: "North Branch",
      status: "In Transit",
      date: "Apr 19, 2025"
    },
    {
      id: "T-2407",
      product: "Loratadine 10mg",
      quantity: 250,
      from: "Main Warehouse",
      to: "East Branch",
      status: "Pending",
      date: "Apr 18, 2025"
    },
    {
      id: "T-2406",
      product: "Omeprazole 20mg",
      quantity: 180,
      from: "North Branch",
      to: "West Branch",
      status: "Completed",
      date: "Apr 15, 2025"
    },
    {
      id: "T-2405",
      product: "Metformin 1000mg",
      quantity: 200,
      from: "Main Warehouse",
      to: "North Branch",
      status: "Completed",
      date: "Apr 12, 2025"
    },
    {
      id: "T-2404",
      product: "Atorvastatin 40mg",
      quantity: 150,
      from: "South Branch",
      to: "East Branch",
      status: "In Transit",
      date: "Apr 11, 2025"
    }
  ]
};

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your pharmaceutical inventory and operations
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                )}>
                  {stat.trend === "up" ? 
                    <ArrowUpIcon className="h-3 w-3" /> : 
                    <ArrowDownIcon className="h-3 w-3" />
                  }
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout for Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                {dashboardData.recentAlerts.length} New
              </span>
            </div>
            <CardDescription>
              Alerts requiring your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className={cn(
                    "mt-0.5 rounded-full p-1",
                    alert.severity === "high" ? "bg-red-100 text-red-700" :
                    alert.severity === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {alert.severity === "high" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : alert.severity === "medium" ? (
                      <RefreshCcw className="h-4 w-4" />
                    ) : (
                      <BarChart3 className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.title}</p>
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Levels */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inventory Levels</CardTitle>
            <CardDescription>
              Current stock vs target levels by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.inventoryLevels.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{item.category}</span>
                    </div>
                    <span className={cn(
                      item.current >= item.target ? "text-emerald-600" : "text-amber-600"
                    )}>
                      {item.current} / {item.target}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        item.current >= item.target ? "bg-emerald-500" : "bg-amber-500"
                      )}
                      style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Transfers - Spans full width */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Recent Transfers</CardTitle>
            <CardDescription>
              Latest inventory transfers between locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">From</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">To</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3.5 text-left text-sm font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                  {dashboardData.recentTransfers.map((transfer, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-foreground">{transfer.id}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">{transfer.product}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">{transfer.quantity}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">{transfer.from}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">{transfer.to}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                          transfer.status === "Completed" ? "bg-green-100 text-green-800" :
                          transfer.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                          "bg-amber-100 text-amber-800"
                        )}>
                          {transfer.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-foreground">{transfer.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
