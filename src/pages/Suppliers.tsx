
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ChevronRight, 
  Truck, 
  Building2, 
  Package, 
  AlertCircle 
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: "active" | "inactive" | "pending";
  productCount: number;
  lastOrderDate: string;
}

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "PharmaCorp Inc.",
      contactPerson: "Michael Brown",
      email: "michael.brown@pharmacorp.com",
      phone: "(800) 555-1234",
      address: "123 Pharma Drive",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      status: "active",
      productCount: 128,
      lastOrderDate: "2025-03-28"
    },
    {
      id: "2",
      name: "MediSupply Co.",
      contactPerson: "Sarah Johnson",
      email: "sarah.j@medisupply.com",
      phone: "(877) 555-2345",
      address: "456 Health Avenue",
      city: "Atlanta",
      state: "GA",
      zipCode: "30301",
      status: "active",
      productCount: 95,
      lastOrderDate: "2025-04-02"
    },
    {
      id: "3",
      name: "Global Medicines Ltd.",
      contactPerson: "David Chen",
      email: "dchen@globalmeds.com",
      phone: "(866) 555-3456",
      address: "789 International Boulevard",
      city: "San Francisco",
      state: "CA",
      zipCode: "94101",
      status: "inactive",
      productCount: 62,
      lastOrderDate: "2025-02-15"
    },
    {
      id: "4",
      name: "BioHealth Solutions",
      contactPerson: "Amanda Garcia",
      email: "agarcia@biohealth.com",
      phone: "(888) 555-4567",
      address: "101 Innovation Way",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      status: "pending",
      productCount: 47,
      lastOrderDate: "2025-03-30"
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{suppliers.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-success mr-2" />
              <span className="text-2xl font-bold">
                {suppliers.filter(s => s.status === "active").length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products from Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-pharma-600 mr-2" />
              <span className="text-2xl font-bold">
                {suppliers.reduce((sum, supplier) => sum + supplier.productCount, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Manage Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search suppliers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    <div>{supplier.name}</div>
                    <div className="text-sm text-muted-foreground">Last order: {supplier.lastOrderDate}</div>
                  </TableCell>
                  <TableCell>
                    <div>{supplier.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{supplier.email}</div>
                    <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div>{supplier.city}, {supplier.state}</div>
                    <div className="text-sm text-muted-foreground">{supplier.address}, {supplier.zipCode}</div>
                  </TableCell>
                  <TableCell>{supplier.productCount}</TableCell>
                  <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
              
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-muted p-3">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No suppliers found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search query
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Suppliers;
