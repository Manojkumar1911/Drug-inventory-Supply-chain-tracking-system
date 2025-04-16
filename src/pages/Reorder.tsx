
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
import { fetchProductsToReorder, createPurchaseOrder } from "@/services/api";
import { useApiStatus } from "@/services/api";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  category: string;
  reorderLevel: number;
  supplier: string;
  location: string;
  unit: string;
}

const Reorder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { status } = useApiStatus();

  // Use the API call to get products that need reordering
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['productsToReorder'],
    queryFn: fetchProductsToReorder,
    enabled: status.server && status.database,
  });

  const filteredProducts = products.filter((product: Product) => 
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReorder = async (productId: string) => {
    try {
      const product = products.find((p: Product) => p._id === productId);
      if (!product) return;
      
      // Simplified PO creation - in a real app, this would open a form
      const orderData = {
        supplier: product.supplier || "Unknown supplier",
        supplierName: product.supplier || "Unknown supplier",
        items: [{
          product: product._id,
          productName: product.name,
          quantity: product.reorderLevel - product.quantity + 5, // Reorder to slightly above reorder level
          unitPrice: 0, // Would be set in the form
          totalPrice: 0 // Would be calculated based on unit price and quantity
        }],
        submittedBy: "System",
        totalAmount: 0, // Would be calculated based on items
        notes: `Automatic reorder for ${product.name} (${product.sku})`
      };
      
      await createPurchaseOrder(orderData);
      
      toast.success("Purchase order created successfully", {
        description: `A purchase order for ${product.name} has been created.`,
      });
      
      // Refresh the product list after reordering
      refetch();
    } catch (error) {
      console.error(`Error reordering product with ID: ${productId}`, error);
      toast.error("Failed to create purchase order", {
        description: "An error occurred while creating the purchase order. Please try again.",
      });
    }
  };

  const handleReorderAll = async () => {
    try {
      // In a real app, this would be a batch operation
      // Here we'll just create multiple POs sequentially for demo purposes
      for (const product of filteredProducts) {
        await handleReorder(product._id);
      }
      
      toast.success(`Reorder complete for ${filteredProducts.length} products`);
    } catch (error) {
      console.error("Error reordering all products", error);
      toast.error("Failed to reorder all products");
    }
  };

  if (!status.database) {
    return (
      <MainLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reorder Management</h1>
        </div>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Database connection error. Please check your MongoDB connection.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reorder Management</h1>
        <Button 
          onClick={handleReorderAll} 
          disabled={filteredProducts.length === 0 || isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reorder All ({filteredProducts.length})
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

          {!isLoading && !error && filteredProducts.length === 0 && (
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

          {!isLoading && !error && filteredProducts.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: Product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div>{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                        {product.quantity} {product.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.reorderLevel} {product.unit}</TableCell>
                    <TableCell>{product.location}</TableCell>
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
