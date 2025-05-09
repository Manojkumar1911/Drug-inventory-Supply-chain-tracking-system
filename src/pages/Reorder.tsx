
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { FilePlus, Search, AlertTriangle, ClipboardList, Package, PlusCircle, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  sku: string;
  location: string;
  category: string;
  quantity: number;
  reorder_level: number;
  days_until_out: number; // Calculated field
  supplier?: string;
}

const Reorder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch products from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      
      // Process data and calculate days_until_out
      const processedData = (data || []).map(product => {
        const dailyUsage = Math.random() * 5 + 1; // Random daily usage between 1 and 6 units
        const daysUntilOut = product.quantity > 0 ? Math.floor(product.quantity / dailyUsage) : 0;
        
        return {
          ...product,
          days_until_out: daysUntilOut,
          supplier: ['ABC Pharma', 'MediSupply', 'Global Health', 'PharmTech'][Math.floor(Math.random() * 4)]
        } as Product;
      });
      
      // Only show products that need reordering (quantity near or below reorder level)
      const reorderProducts = processedData.filter(p => p.quantity <= p.reorder_level * 1.2);
      
      setProducts(reorderProducts);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products data");
      
      // Demo data
      const sampleData: Product[] = [
        {
          id: '1',
          name: 'Amoxicillin 500mg',
          sku: 'AMX500',
          location: 'Main Warehouse',
          category: 'Antibiotics',
          quantity: 25,
          reorder_level: 50,
          days_until_out: 5,
          supplier: 'ABC Pharma'
        },
        {
          id: '2',
          name: 'Lisinopril 10mg',
          sku: 'LIS10',
          location: 'Main Warehouse',
          category: 'Blood Pressure',
          quantity: 15,
          reorder_level: 40,
          days_until_out: 3,
          supplier: 'MediSupply'
        },
        {
          id: '3',
          name: 'Metformin 1000mg',
          sku: 'MET1000',
          location: 'Main Warehouse',
          category: 'Diabetes',
          quantity: 32,
          reorder_level: 30,
          days_until_out: 8,
          supplier: 'Global Health'
        },
        {
          id: '4',
          name: 'Atorvastatin 20mg',
          sku: 'ATO20',
          location: 'Main Warehouse',
          category: 'Cholesterol',
          quantity: 18,
          reorder_level: 45,
          days_until_out: 4,
          supplier: 'PharmTech'
        },
        {
          id: '5',
          name: 'Sertraline 50mg',
          sku: 'SER50',
          location: 'Main Warehouse',
          category: 'Mental Health',
          quantity: 10,
          reorder_level: 25,
          days_until_out: 2,
          supplier: 'Global Health'
        }
      ];
      
      setProducts(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredProducts.map(p => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleToggleItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleCreatePurchaseOrder = () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one product");
      return;
    }
    
    toast.success(`Created purchase order with ${selectedItems.length} products`);
    setSelectedItems([]);
  };

  const getUrgencyLevel = (daysUntilOut: number) => {
    if (daysUntilOut <= 3) return 'critical';
    if (daysUntilOut <= 7) return 'high';
    if (daysUntilOut <= 14) return 'medium';
    return 'low';
  };

  const getUrgencyBadge = (daysUntilOut: number) => {
    const level = getUrgencyLevel(daysUntilOut);
    
    switch(level) {
      case 'critical':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            Critical ({daysUntilOut} days)
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            High ({daysUntilOut} days)
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
            Medium ({daysUntilOut} days)
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
            Low ({daysUntilOut} days)
          </Badge>
        );
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Apply filters
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    // Urgency filter
    const urgencyLevel = getUrgencyLevel(product.days_until_out);
    const matchesUrgency = urgencyFilter === 'all' || urgencyLevel === urgencyFilter;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const criticalCount = products.filter(p => getUrgencyLevel(p.days_until_out) === 'critical').length;
  const highCount = products.filter(p => getUrgencyLevel(p.days_until_out) === 'high').length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Reorder</h1>
          <p className="text-muted-foreground">
            Manage products that need to be reordered soon
          </p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleCreatePurchaseOrder}
          disabled={selectedItems.length === 0}
        >
          <FilePlus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 dark:bg-red-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
              Critical Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">{criticalCount}</span>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Out of stock within 3 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 dark:bg-orange-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">
              High Priority Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 text-orange-600 dark:text-orange-500 mr-2" />
              <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">{highCount}</span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Out of stock within 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reorder Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{products.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items below or near reorder level
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Reorder List</CardTitle>
          <CardDescription>
            Select items to include in a new purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={filteredProducts.length > 0 && selectedItems.length === filteredProducts.length} 
                          onCheckedChange={handleToggleAll}
                        />
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Supplier</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedItems.includes(product.id)}
                              onCheckedChange={(checked) => handleToggleItem(product.id, checked === true)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.sku}</div>
                          </TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.reorder_level}</TableCell>
                          <TableCell>{getUrgencyBadge(product.days_until_out)}</TableCell>
                          <TableCell>{product.supplier}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center text-center">
                            <FileCheck className="h-8 w-8 text-green-500 mb-2" />
                            <h3 className="text-lg font-medium">No reorder items found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {searchQuery || categoryFilter !== 'all' || urgencyFilter !== 'all' ? 
                                "Try adjusting your filters" : 
                                "All items are above reorder levels"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredProducts.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {selectedItems.length > 0 ? 
                      `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected` : 
                      'Select items to create a purchase order'
                    }
                  </div>
                  <Button 
                    onClick={handleCreatePurchaseOrder}
                    disabled={selectedItems.length === 0}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Order
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reorder;
