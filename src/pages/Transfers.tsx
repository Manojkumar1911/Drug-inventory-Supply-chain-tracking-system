
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowLeftRight,
  Calendar,
  Check,
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample transfers data
const transfersData = [
  {
    id: "TRF-3021",
    product: "Amoxicillin 500mg",
    quantity: 500,
    from: "Main Warehouse",
    to: "North Branch",
    requestedBy: "John Smith",
    status: "Pending Approval",
    priority: "Normal",
    createdAt: "Apr 14, 2025"
  },
  {
    id: "TRF-3020",
    product: "Lisinopril 10mg",
    quantity: 300,
    from: "South Branch",
    to: "West Branch",
    requestedBy: "Maria Garcia",
    status: "In Transit",
    priority: "High",
    createdAt: "Apr 13, 2025"
  },
  {
    id: "TRF-3019",
    product: "Insulin Glargine 100mL",
    quantity: 50,
    from: "Main Warehouse",
    to: "East Branch",
    requestedBy: "Alex Johnson",
    status: "Completed",
    priority: "Urgent",
    createdAt: "Apr 12, 2025"
  },
  {
    id: "TRF-3018",
    product: "Atorvastatin 40mg",
    quantity: 250,
    from: "North Branch",
    to: "South Branch",
    requestedBy: "Sarah Williams",
    status: "In Transit",
    priority: "Normal",
    createdAt: "Apr 12, 2025"
  },
  {
    id: "TRF-3017",
    product: "Metformin 1000mg",
    quantity: 400,
    from: "Main Warehouse",
    to: "West Branch",
    requestedBy: "Robert Brown",
    status: "Completed",
    priority: "Low",
    createdAt: "Apr 11, 2025"
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300";
    case "In Transit":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
    case "Pending Approval":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case "Urgent":
      return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300";
    case "High":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300";
    case "Normal":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
    case "Low":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const Transfers = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
            <p className="text-muted-foreground">
              Manage medication transfers between locations
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Transfer
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers..."
                className="w-full bg-background pl-8 shadow-none md:max-w-sm"
              />
            </div>
            <Button variant="outline" size="icon" title="Advanced search">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Advanced search</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All Transfers</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pending</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Completed</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Transfer Requests</CardTitle>
            <CardDescription>
              View and manage medication transfers between locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfersData.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">{transfer.id}</TableCell>
                      <TableCell>{transfer.product}</TableCell>
                      <TableCell>{transfer.quantity}</TableCell>
                      <TableCell>{transfer.from}</TableCell>
                      <TableCell>{transfer.to}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(transfer.priority)} variant="outline">
                          {transfer.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{transfer.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit transfer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Transfers;
