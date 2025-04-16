
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search, PlusCircle, RefreshCw } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
  reorderLevel: number;
  supplier: string;
}

const Reorder = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock query since the API doesn't exist yet
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // In a real app, this would fetch from an API endpoint
      // Returning mock data for now
      return [
        { _id: "1", name: "Paracetamol", sku: "PCM100", quantity: 5, category: "Pain Relief", reorderLevel: 10, supplier: "PharmaCorp" },
        { _id: "2", name: "Amoxicillin", sku: "AMX250", quantity: 3, category: "Antibiotics", reorderLevel: 15, supplier: "MediSupply" },
        { _id: "3", name: "Ibuprofen", sku: "IBU200", quantity: 8, category: "Pain Relief", reorderLevel: 20, supplier: "HealthMeds" },
        { _id: "4", name: "Cetirizine", sku: "CTZ10", quantity: 2, category: "Allergy", reorderLevel: 5, supplier: "AllerCare" },
      ];
    },
  });

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const productsToReorder = filteredProducts.filter(product => product.quantity < product.reorderLevel);

  const handleReorder = (productId: string) => {
    console.log(`Reordering product with ID: ${productId}`);
    // In a real app, this would trigger an API call
  };

  const handleReorderAll = () => {
    console.log("Reordering all products below threshold");
    // In a real app, this would trigger a batch API call
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reorder Management</h1>
        <Button 
          onClick={handleReorderAll} 
          disabled={productsToReorder.length === 0}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reorder All ({productsToReorder.length})
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Product Inventory Below Reorder Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading && <p className="text-center py-4">Loading inventory data...</p>}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load inventory data. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && productsToReorder.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium">All products are above reorder levels</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No products currently require reordering
              </p>
            </div>
          )}

          {!isLoading && !error && productsToReorder.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsToReorder.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                        {product.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.reorderLevel}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleReorder(product._id)}
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default Reorder;
