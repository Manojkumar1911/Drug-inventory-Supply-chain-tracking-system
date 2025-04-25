
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, ChevronRight, Edit, Phone, PlusCircle, Search, Truck, Trash2 } from "lucide-react";

// Mock suppliers data
const suppliersData = [
  {
    id: 1,
    name: "MediPharm Inc.",
    contactPerson: "Sarah Johnson",
    phone: "(617) 555-7890",
    email: "sarah.j@medipharm.com",
    address: "123 Pharma Avenue, Boston, MA 02108",
    isActive: true,
    productsSupplied: 128,
    leadTime: 7,
    rating: 5
  },
  {
    id: 2,
    name: "Global Health Supplies",
    contactPerson: "Michael Chen",
    phone: "(617) 555-3456",
    email: "m.chen@globalhealthsupplies.com",
    address: "456 Medical Drive, Cambridge, MA 02139",
    isActive: true,
    productsSupplied: 92,
    leadTime: 10,
    rating: 4
  },
  {
    id: 3,
    name: "Pharmatech Solutions",
    contactPerson: "David Wilson",
    phone: "(617) 555-2345",
    email: "david@pharmatechsolutions.com",
    address: "789 Research Blvd, Waltham, MA 02451",
    isActive: true,
    productsSupplied: 76,
    leadTime: 14,
    rating: 3
  },
  {
    id: 4,
    name: "MedLogistics Corp",
    contactPerson: "Jennifer Lopez",
    phone: "(617) 555-8765",
    email: "jlopez@medlogistics.com",
    address: "101 Supply Chain Road, Quincy, MA 02169",
    isActive: false,
    productsSupplied: 0,
    leadTime: 21,
    rating: 2
  },
  {
    id: 5,
    name: "BioCare Distributors",
    contactPerson: "Robert Smith",
    phone: "(617) 555-4321",
    email: "rsmith@biocare.com",
    address: "202 Health Street, Newton, MA 02458",
    isActive: true,
    productsSupplied: 113,
    leadTime: 5,
    rating: 5
  }
];

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSuppliers = suppliersData.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalActiveSuppliers = suppliersData.filter(s => s.isActive).length;
  const totalProducts = suppliersData.reduce((sum, supplier) => sum + supplier.productsSupplied, 0);
  const averageLeadTime = suppliersData.reduce((sum, supplier) => sum + supplier.leadTime, 0) / suppliersData.length;
  
  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{totalActiveSuppliers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products Supplied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-pharma-600 mr-2" />
              <span className="text-2xl font-bold">{totalProducts}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Lead Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-success mr-2" />
              <span className="text-2xl font-bold">{averageLeadTime.toFixed(1)} days</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Suppliers</CardTitle>
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
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Lead Time</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div>{supplier.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{supplier.email}</div>
                  </TableCell>
                  <TableCell>{supplier.productsSupplied}</TableCell>
                  <TableCell>{supplier.leadTime} days</TableCell>
                  <TableCell>
                    <span className={`text-sm ${supplier.rating >= 4 ? 'text-amber-500' : supplier.rating >= 3 ? 'text-amber-400' : 'text-gray-400'}`}>
                      {getRatingStars(supplier.rating)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {supplier.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
