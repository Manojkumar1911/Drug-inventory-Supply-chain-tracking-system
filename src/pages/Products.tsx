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
import { toast } from "@/components/ui/sonner";

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/products', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        toast("Success", {
          description: "CSV file uploaded successfully"
        });
        window.location.reload();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast("Error", {
        description: "Failed to upload CSV file"
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Products</h1>
            <p className="text-muted-foreground">
              Manage your pharmaceutical inventory
            </p>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" className="gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20">
                <Download className="h-4 w-4" />
                Upload CSV
              </Button>
            </label>
            <Button className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
              <PackagePlus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
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
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50">
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
          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50">
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50">
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

        <Card className="bg-gradient-to-br from-card to-muted/50">
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
