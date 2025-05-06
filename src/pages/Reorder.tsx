import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  RefreshCw,
  Search, 
  ShoppingCart, 
  Truck 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchProductsToReorder, createPurchaseOrder } from "@/services/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReorderProduct {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  supplier: string;
  unitPrice: number;
  category: string;
  lastOrdered: string;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  orderDate: string;
  items: number;
  total: number;
  status: "Delivered" | "In Transit" | "Processing";
}

const Reorder = () => {
  const [reorderProducts, setReorderProducts] = useState<ReorderProduct[]>([]);
  const [recentPurchaseOrders, setRecentPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadProducts();
    
    // Set up real-time subscription for product changes
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        // Reload products when changes occur
        loadProducts();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch products that need reordering using Supabase
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .lte('quantity', supabase.raw('reorder_level'));
      
      if (error) {
        throw error;
      }

      if (productsData && Array.isArray(productsData) && productsData.length > 0) {
        // Convert API data to our display format
        const formattedProducts: ReorderProduct[] = productsData.map((product: any) => ({
          id: product.id || Math.floor(Math.random() * 1000),
          name: product.name,
          sku: product.sku,
          currentStock: product.quantity || 0,
          reorderLevel: product.reorder_level || 0,
          supplier: product.manufacturer || "Unknown",
          unitPrice: 0.99, // Sample price since it may not be in API data
          category: product.category || "General",
          lastOrdered: new Date().toISOString().split('T')[0]
        }));
        
        setReorderProducts(formattedProducts);
        
        // Generate sample purchase orders based on actual suppliers
        const suppliers = [...new Set(formattedProducts.map(p => p.supplier))];
        if (suppliers.length > 0) {
          const sampleOrders = suppliers.slice(0, 3).map((supplier, index) => ({
            id: `PO-24${String(index + 1).padStart(2, '0')}`,
            supplier,
            orderDate: new Date(Date.now() - (index * 5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            items: Math.floor(Math.random() * 10) + 5,
            total: Math.round(Math.random() * 5000) + 1000,
            status: ["Delivered", "In Transit", "Processing"][index % 3] as "Delivered" | "In Transit" | "Processing"
          }));
          setRecentPurchaseOrders(sampleOrders);
        } else {
          setRecentPurchaseOrders([]);
        }
      } else {
        // No products need reordering
        setReorderProducts([]);
        setRecentPurchaseOrders([]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products for reordering. Please try again.");
      toast.error("Failed to load products for reordering");
      setReorderProducts([]);
      setRecentPurchaseOrders([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredProducts = reorderProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (selectedSupplier && product.supplier === selectedSupplier)
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
  
  const createPurchaseOrder = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }
    
    setCreatingOrder(true);
    
    try {
      // Get selected products details
      const selectedProductsDetails = reorderProducts.filter(p => selectedProducts.includes(p.id));
      
      // Calculate quantities to order (reorder level - current stock)
      const orderItems = selectedProductsDetails.map(product => ({
        product_id: product.id,
        product_name: product.name,
        quantity: Math.max(0, product.reorderLevel - product.currentStock),
        unit_price: product.unitPrice,
        total_price: product.unitPrice * Math.max(0, product.reorderLevel - product.currentStock)
      }));
      
      const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);
      
      // Create new purchase order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          supplier_name: selectedSupplier || "Multiple Suppliers",
          total_amount: totalAmount,
          status: "Processing",
          order_number: `PO-${Date.now().toString().substring(6)}`,
          submitted_by: "Current User",
          payment_status: "Unpaid"
        })
        .select()
        .single();
        
      if (orderError) {
        throw orderError;
      }
      
      // Add order items
      if (orderData) {
        const orderItemsWithOrderId = orderItems.map(item => ({
          ...item,
          purchase_order_id: orderData.id
        }));
        
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(orderItemsWithOrderId);
          
        if (itemsError) {
          throw itemsError;
        }
      }
      
      toast.success("Purchase order created successfully");
      
      // Add the new order to the list
      const newOrder = {
        id: orderData.order_number,
        supplier: selectedSupplier || "Multiple Suppliers",
        orderDate: new Date().toISOString().split('T')[0],
        items: selectedProducts.length,
        total: totalAmount,
        status: "Processing" as const
      };
      
      setRecentPurchaseOrders(prev => [newOrder, ...prev]);
      setSelectedProducts([]);
      setSelectedSupplier("");
      
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setCreatingOrder(false);
    }
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
          <Button 
            className="flex items-center gap-2"
            onClick={createPurchaseOrder}
            disabled={creatingOrder || selectedProducts.length === 0}
          >
            {creatingOrder ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Create Order
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Status Cards */}
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
      
      {/* Main Content Tabs */}
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
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={loadProducts}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  {selectedProducts.length > 0 && (
                    <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
                      <span className="text-sm">{selectedProducts.length} products selected</span>
                      <div className="flex gap-2">
                        <Select disabled={creatingOrder} value={selectedSupplier} onValueChange={setSelectedSupplier}>
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
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>Loading products that need reordering...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center p-8 text-red-500">
                      <p>{error}</p>
                      <Button 
                        variant="outline" 
                        onClick={loadProducts} 
                        className="mt-4"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox 
                              checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
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
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
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
                                      style={{ width: `${Math.min(getStockPercentage(product.currentStock, product.reorderLevel), 100)}%` }}
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
                                  {Math.max(0, product.reorderLevel - product.currentStock)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                  <ChevronRight className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center">
                              {searchQuery || selectedSupplier ? (
                                <p>No products match your search criteria</p>
                              ) : (
                                <p>No products currently need reordering</p>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
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
              {recentPurchaseOrders.length > 0 ? (
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
              ) : (
                <div className="p-8 text-center">
                  <p>No purchase orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reorder;
