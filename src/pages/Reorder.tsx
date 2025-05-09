
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowUp, Clipboard, ClipboardCheck, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorder_level: number;
  quantity_needed: number;
  location: string;
  manufacturer: string;
}

const Reorder: React.FC = () => {
  const [reorderItems, setReorderItems] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate loading reorder products
  const { isLoading, error } = useQuery({
    queryKey: ['reorder-products'],
    queryFn: async () => {
      // Simulate an API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Sample reorder products (in a real app, this would come from the API)
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Amoxicillin 500mg",
          sku: "AMOX-500",
          category: "Antibiotics",
          quantity: 5,
          reorder_level: 20,
          quantity_needed: 15,
          location: "Warehouse A",
          manufacturer: "MediPharm Inc."
        },
        {
          id: 2,
          name: "Ibuprofen 200mg",
          sku: "IBU-200",
          category: "Pain Relief",
          quantity: 8,
          reorder_level: 25,
          quantity_needed: 17,
          location: "Warehouse B",
          manufacturer: "Pharma Solutions"
        },
        {
          id: 3,
          name: "Loratadine 10mg",
          sku: "LOR-10",
          category: "Allergy",
          quantity: 4,
          reorder_level: 15,
          quantity_needed: 11,
          location: "Warehouse A",
          manufacturer: "HealthCare Ltd."
        },
        {
          id: 4,
          name: "Aspirin 325mg",
          sku: "ASP-325",
          category: "Pain Relief",
          quantity: 0,
          reorder_level: 20,
          quantity_needed: 20,
          location: "Warehouse C",
          manufacturer: "MediPharm Inc."
        },
        {
          id: 5,
          name: "Cetirizine 10mg",
          sku: "CET-10",
          category: "Allergy",
          quantity: 2,
          reorder_level: 10,
          quantity_needed: 8,
          location: "Warehouse B",
          manufacturer: "HealthCare Ltd."
        }
      ];

      setReorderItems(mockProducts);
      return mockProducts;
    }
  });

  // Function to toggle selection of a product
  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Function to select/deselect all products
  const toggleAllProducts = () => {
    if (Object.keys(selectedProducts).length === reorderItems.length) {
      setSelectedProducts({});
    } else {
      const allSelected: Record<number, boolean> = {};
      reorderItems.forEach(product => {
        allSelected[product.id] = true;
      });
      setSelectedProducts(allSelected);
    }
  };

  // Function to generate purchase order
  const generatePurchaseOrder = () => {
    const selectedProductIds = Object.keys(selectedProducts)
      .filter(id => selectedProducts[parseInt(id)])
      .map(id => parseInt(id));
    
    if (selectedProductIds.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Purchase order created successfully");
      setIsGenerating(false);
      
      // In a real app, this would navigate to the newly created order
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reorder Products</h1>
          <p className="text-muted-foreground">
            Manage inventory levels and create purchase orders for low stock items
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          disabled={Object.keys(selectedProducts).filter(id => selectedProducts[parseInt(id)]).length === 0 || isGenerating}
          onClick={generatePurchaseOrder}
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Creating Order...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Create Purchase Order</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{reorderItems.length}</div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{reorderItems.filter(item => item.quantity === 0).length}</div>
              <ArrowUp className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Selected for Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {Object.keys(selectedProducts).filter(id => selectedProducts[parseInt(id)]).length}
              </div>
              <Clipboard className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products Needing Reorder</CardTitle>
              <CardDescription>
                Products below their reorder level threshold
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAllProducts}
              className="hidden sm:flex items-center gap-1.5"
            >
              <ClipboardCheck className="h-4 w-4" />
              {Object.keys(selectedProducts).length === reorderItems.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={Object.keys(selectedProducts).length === reorderItems.length && reorderItems.length > 0}
                      onChange={toggleAllProducts}
                    />
                  </div>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Reorder Level</TableHead>
                <TableHead className="text-right">Needed</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : reorderItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No products need reordering at this time
                  </TableCell>
                </TableRow>
              ) : (
                reorderItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={!!selectedProducts[product.id]}
                          onChange={() => toggleProductSelection(product.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.quantity === 0 ? "text-red-500 font-medium" : ""}>
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{product.reorder_level}</TableCell>
                    <TableCell className="text-right font-medium text-amber-600">
                      {product.quantity_needed}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{product.location}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reorder;
