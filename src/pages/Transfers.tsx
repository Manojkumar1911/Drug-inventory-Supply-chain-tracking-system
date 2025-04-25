
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RefreshCcw, 
  PlusCircle, 
  Search, 
  ArrowRightLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Edit,
  Trash2
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for transfers
const transfersData = [
  {
    id: "TR-2405",
    product: "Amoxicillin 500mg",
    quantity: 150,
    fromLocation: "Main Warehouse",
    toLocation: "Downtown Branch",
    requestedBy: "Sarah Johnson",
    status: "Completed",
    priority: "Normal",
    requestDate: "2025-04-15T09:30:00",
    completedDate: "2025-04-17T14:15:00"
  },
  {
    id: "TR-2406",
    product: "Metformin 1000mg",
    quantity: 200,
    fromLocation: "Main Warehouse",
    toLocation: "Cambridge Branch",
    requestedBy: "Michael Chen",
    status: "In Transit",
    priority: "High",
    requestDate: "2025-04-18T11:20:00",
    completedDate: null
  },
  {
    id: "TR-2407",
    product: "Lisinopril 10mg",
    quantity: 75,
    fromLocation: "Main Warehouse",
    toLocation: "Boston Branch",
    requestedBy: "John Smith",
    status: "Pending Approval",
    priority: "Normal",
    requestDate: "2025-04-22T16:45:00",
    completedDate: null
  },
  {
    id: "TR-2408",
    product: "Atorvastatin 40mg",
    quantity: 100,
    fromLocation: "Cambridge Branch",
    toLocation: "Downtown Branch",
    requestedBy: "Lisa Rodriguez",
    status: "Rejected",
    priority: "Low",
    requestDate: "2025-04-19T10:30:00",
    completedDate: "2025-04-20T13:45:00"
  },
  {
    id: "TR-2409",
    product: "Sertraline 100mg",
    quantity: 60,
    fromLocation: "Downtown Branch",
    toLocation: "Cambridge Branch",
    requestedBy: "Robert Johnson",
    status: "Pending Approval",
    priority: "Urgent",
    requestDate: "2025-04-23T09:15:00",
    completedDate: null
  },
  {
    id: "TR-2410",
    product: "Albuterol Inhaler",
    quantity: 30,
    fromLocation: "Main Warehouse",
    toLocation: "Boston Branch",
    requestedBy: "Emily Wilson",
    status: "Completed",
    priority: "High",
    requestDate: "2025-04-16T14:30:00",
    completedDate: "2025-04-18T11:20:00"
  }
];

const Transfers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const filteredTransfers = transfersData.filter(transfer => {
    // Search filter
    const matchesSearch = 
      transfer.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Status filter
    const matchesStatus = statusFilter === "all" || transfer.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Priority filter
    const matchesPriority = priorityFilter === "all" || transfer.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Count transfers by status
  const pendingCount = transfersData.filter(t => t.status === "Pending Approval").length;
  const inTransitCount = transfersData.filter(t => t.status === "In Transit").length;
  const completedCount = transfersData.filter(t => t.status === "Completed").length;
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Completed</Badge>;
      case "In Transit":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">In Transit</Badge>;
      case "Pending Approval":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">Pending Approval</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "Urgent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300">Urgent</Badge>;
      case "High":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300">High</Badge>;
      case "Normal":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300">Normal</Badge>;
      case "Low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900/30 dark:text-gray-300">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Transfers</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Transfer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <RefreshCcw className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{inTransitCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{completedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transfer Requests</CardTitle>
          <CardDescription>Manage inventory movement between locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transfers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending approval">Pending Approval</SelectItem>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead>From → To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">{transfer.id}</TableCell>
                    <TableCell>{transfer.product}</TableCell>
                    <TableCell className="text-center">{transfer.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{transfer.fromLocation}</span>
                        <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground rotate-90" />
                        <span className="text-sm">{transfer.toLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>{getPriorityBadge(transfer.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(transfer.requestDate)}</div>
                      {transfer.completedDate && (
                        <div className="text-xs text-muted-foreground">
                          Completed: {formatDate(transfer.completedDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" disabled={transfer.status === "Completed" || transfer.status === "Rejected"}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={transfer.status === "Completed"}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredTransfers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No transfers found</h3>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transfers;
