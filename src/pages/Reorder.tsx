
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronRight, 
  FileSpreadsheet, 
  FilterIcon, 
  Loader2, 
  PlusCircle, 
  Search, 
  ShoppingCart, 
  Truck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for reorder products
const reorderProducts = [
  {
    id: 1,
    name: "Amoxicillin 500mg",
    sku: "AMX500-120",
    currentStock: 45,
    reorderLevel: 100,
    supplier: "MediPharm Inc.",
    unitPrice: 0.89,
    category: "Antibiotics",
    lastOrdered: "2025-03-15"
  },
  {
    id: 2,
    name: "Metformin 1000mg",
    sku: "MET1000-500",
    currentStock: 75,
    reorderLevel: 200,
    supplier: "Global Health Supplies",
    unitPrice: 0.12,
    category: "Diabetes",
    lastOrdered: "2025-04-01"
  },
  {
    id: 3,
    name: "Lisinopril 10mg",
    sku: "LIS010-250",
    currentStock: 30,
    reorderLevel: 120,
    supplier: "MediPharm Inc.",
    unitPrice: 0.34,
    category: "Cardiovascular",
    lastOrdered: "2025-03-22"
  },
  {
    id: 4,
    name: "Albuterol Inhaler",
    sku: "ALB-INH-60",
    currentStock: 12,
    reorderLevel: 40,
    supplier: "Pharmatech Solutions",
    unitPrice: 23.75,
    category: "Respiratory",
    lastOrdered: "2025-03-10"
  },
  {
    id: 5,
    name: "Atorvastatin 40mg",
    sku: "ATV040-90",
    currentStock: 55,
    reorderLevel: 100,
    supplier: "Global Health Supplies",
    unitPrice: 0.45,
    category: "Cardiovascular",
    lastOrdered: "2025-02-28"
  }
];

// Mock data for recent purchase orders
const recentPurchaseOrders = [
  {
    id: "PO-2405",
    supplier: "MediPharm Inc.",
    orderDate: "2025-04-15",
    items: 12,
    total: 4285.75,
    status: "Delivered"
  },
  {
    id: "PO-2404",
    supplier: "Global Health Supplies",
    orderDate: "2025-04-10",
    items: 8,
    total: 2156.30,
    status: "In Transit"
  },
  {
    id: "PO-2403",
    supplier: "Pharmatech Solutions",
    orderDate: "2025-04-05",
    items: 5,
    total: 945.25,
    status: "Processing"
  },
  {
    id: "PO-2402",
    supplier: "MediPharm Inc.",
    orderDate: "2025-03-28",
    items: 15,
    total: 6234.80,
    status: "Delivered"
  }
];

const Reorder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  
  const filteredProducts = reorderProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const suppliers = [...new Set(reorderProducts.map(product => product.supplier))];
  
  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };
  
  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };
  
  const createPurchaseOrder = () => {
    setCreatingOrder(true);
    setTimeout(() => {
      setCreatingOrder(false);
      setSelectedProducts([]);
      setSelectedSupplier("");
    }, 1500);
  };
  
  const getStockPercentage = (current: number, reorderLevel: number) => {
    return Math.round((current / reorderLevel) * 100);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Reorder</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Order
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">{reorderProducts.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">
                {recentPurchaseOrders.filter(order => 
                  order.status === "Processing" || order.status === "In Transit"
                ).length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value to Reorder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {formatCurrency(
                  reorderProducts.reduce((sum, product) => 
                    sum + (product.reorderLevel - product.currentStock) * product.unitPrice, 0
                  )
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="reorder-items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reorder-items">Reorder Items</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reorder-items">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Below Reorder Level</CardTitle>
              <CardDescription>
                Items that need to be reordered based on current stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Suppliers</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="icon">
                      <FilterIcon className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  {selectedProducts.length > 0 && (
                    <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
                      <span className="text-sm">{selectedProducts.length} products selected</span>
                      <div className="flex gap-2">
                        <Select disabled={creatingOrder}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm" 
                          onClick={createPurchaseOrder}
                          disabled={creatingOrder}
                        >
                          {creatingOrder ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating
                            </>
                          ) : (
                            "Create Order"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox 
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onCheckedChange={selectAllProducts}
                            disabled={filteredProducts.length === 0}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Last Ordered</TableHead>
                        <TableHead>To Order</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => toggleProductSelection(product.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{product.currentStock}</span>
                              <div className="h-1.5 w-20 bg-muted rounded-full mt-1 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    getStockPercentage(product.currentStock, product.reorderLevel) < 25
                                      ? "bg-red-500"
                                      : getStockPercentage(product.currentStock, product.reorderLevel) < 50
                                      ? "bg-amber-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${getStockPercentage(product.currentStock, product.reorderLevel)}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.reorderLevel}</TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
                          <TableCell>{formatDate(product.lastOrdered)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                              {product.reorderLevel - product.currentStock}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="h-24 text-center">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>
                Track and manage your recent purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPurchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === "Delivered" 
                              ? "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300" 
                              : order.status === "In Transit" 
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reorder;
