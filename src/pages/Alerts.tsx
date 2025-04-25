
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample alerts data
const alertsData = [
  {
    id: "ALT-3845",
    title: "Low Stock Alert",
    description: "Amoxicillin 500mg is below minimum threshold",
    severity: "high",
    status: "New",
    category: "Inventory",
    location: "Main Warehouse",
    timestamp: "April 14, 2025 - 10:24 AM"
  },
  {
    id: "ALT-3844",
    title: "Expiration Warning",
    description: "Insulin Glargine 100mL expires in 30 days",
    severity: "medium",
    status: "In Progress",
    category: "Expiry",
    location: "Cold Storage A",
    timestamp: "April 14, 2025 - 08:15 AM"
  },
  {
    id: "ALT-3843",
    title: "Transfer Request",
    description: "Boston Branch requested Lisinopril 10mg (45 units)",
    severity: "low",
    status: "New",
    category: "Transfer",
    location: "Boston Branch",
    timestamp: "April 13, 2025 - 03:42 PM"
  },
  {
    id: "ALT-3842",
    title: "Temperature Excursion",
    description: "Temperature exceeded threshold in Cold Storage B",
    severity: "critical",
    status: "Resolved",
    category: "Storage",
    location: "Cold Storage B",
    timestamp: "April 13, 2025 - 02:17 PM"
  },
  {
    id: "ALT-3841",
    title: "Supplier Delayed Delivery",
    description: "MediPharm Inc. reported 3-day delay for order #ORD-2934",
    severity: "medium",
    status: "In Progress",
    category: "Supply Chain",
    location: "All Locations",
    timestamp: "April 13, 2025 - 09:31 AM"
  }
];

const getSeverityColor = (severity: string) => {
  switch(severity) {
    case "critical":
      return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300";
    case "high":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300";
    case "medium":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300";
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case "New":
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
    case "Resolved":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "Inventory":
      return <AlertCircle className="h-4 w-4" />;
    case "Expiry":
      return <Clock className="h-4 w-4" />;
    case "Transfer":
      return <RefreshCcw className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const Alerts = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          Manage and respond to system alerts and notifications
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Active Alerts</CardTitle>
            <Badge className="bg-red-500 hover:bg-red-600">{alertsData.length} Active</Badge>
          </div>
          <CardDescription>
            Alerts requiring attention across all systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertsData.map((alert) => (
              <div key={alert.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "rounded-full p-1",
                      getSeverityColor(alert.severity).split(' ')[0]
                    )}>
                      {getCategoryIcon(alert.category)}
                    </div>
                    <span className="font-medium">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(getStatusColor(alert.status))}>
                      {alert.status}
                    </Badge>
                    <Badge className={cn(getSeverityColor(alert.severity))}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>ID: {alert.id}</div>
                  <div>Location: {alert.location}</div>
                  <div>Category: {alert.category}</div>
                  <div>{alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
