
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Calendar, 
  Download, 
  Filter, 
  MoreHorizontal, 
  PackagePlus, 
  RefreshCw, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: {
    current: number;
    minimum: number;
  };
  location: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Expiring Soon";
  expiryDate?: string;
}

const products: Product[] = [
  {
    id: "P001",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    sku: "AMX500-100",
    stock: {
      current: 120,
      minimum: 150,
    },
    location: "Shelf A-12",
    supplier: "MediPharm Inc.",
    status: "Low Stock",
    expiryDate: "Jan 15, 2026",
  },
  {
    id: "P002",
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    sku: "LSN010-60",
    stock: {
      current: 45,
      minimum: 50,
    },
    location: "Shelf B-03",
    supplier: "PharmaTech",
    status: "Low Stock",
    expiryDate: "Mar 22, 2026",
  },
  {
    id: "P003",
    name: "Insulin Glargine 100mL",
    category: "Diabetes",
    sku: "INS100-10",
    stock: {
      current: 85,
      minimum: 50,
    },
    location: "Cold Storage A",
    supplier: "BioLife",
    status: "Expiring Soon",
    expiryDate: "May 10, 2025",
  },
  {
    id: "P004",
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    sku: "IBP200-500",
    stock: {
      current: 320,
      minimum: 100,
    },
    location: "Shelf D-07",
    supplier: "MediPharm Inc.",
    status: "In Stock",
    expiryDate: "Sep 30, 2026",
  },
  {
    id: "P005",
    name: "Metformin 1000mg",
    category: "Diabetes",
    sku: "MET1000-100",
    stock: {
      current: 0,
      minimum: 50,
    },
    location: "Shelf C-04",
    supplier: "PharmaTech",
    status: "Out of Stock",
    expiryDate: "Aug 15, 2026",
  },
  {
    id: "P006",
    name: "Atorvastatin 40mg",
    category: "Cardiovascular",
    sku: "ATV040-90",
    stock: {
      current: 76,
      minimum: 30,
    },
    location: "Shelf B-01",
    supplier: "MediPharm Inc.",
    status: "In Stock",
    expiryDate: "Nov 05, 2026",
  },
  {
    id: "P007",
    name: "Albuterol Inhaler",
    category: "Respiratory",
    sku: "ALB100-12",
    stock: {
      current: 18,
      minimum: 20,
    },
    location: "Shelf E-09",
    supplier: "RespiraTech",
    status: "Low Stock",
    expiryDate: "Feb 28, 2026",
  },
  {
    id: "P008",
    name: "Loratadine 10mg",
    category: "Allergy",
    sku: "LRT010-30",
    stock: {
      current: 67,
      minimum: 25,
    },
    location: "Shelf D-02",
    supplier: "PharmaTech",
    status: "In Stock",
    expiryDate: "Dec 12, 2025",
  },
];

const Products: React.FC = () => {
  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300";
      case "Low Stock":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300";
      case "Out of Stock":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300";
      case "Expiring Soon":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your pharmaceutical inventory
            </p>
          </div>
          <Button className="gap-2">
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full bg-background pl-8 shadow-none md:max-w-sm"
              />
            </div>
            <Button variant="outline" size="icon" title="Filter">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon" title="Advanced search">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only">Advanced search</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Across 6 categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.status === "Low Stock").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Below minimum threshold
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.status === "Out of Stock").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires immediate reorder
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.status === "Expiring Soon").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Within 90 days
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Inventory List</CardTitle>
            <CardDescription>
              Manage and monitor your pharmaceutical products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={cn(
                            product.stock.current < product.stock.minimum 
                              ? "text-amber-600 dark:text-amber-400" 
                              : ""
                          )}>
                            {product.stock.current}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Min: {product.stock.minimum}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{product.expiryDate}</span>
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
                            <DropdownMenuItem>Edit product</DropdownMenuItem>
                            <DropdownMenuItem>Adjust stock</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Transfer stock</DropdownMenuItem>
                            <DropdownMenuItem>Generate reorder</DropdownMenuItem>
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

export default Products;
