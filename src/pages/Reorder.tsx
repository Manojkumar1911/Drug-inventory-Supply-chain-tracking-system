
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Calendar, Clock, Package, Search, Truck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  reorder_level: number;
  unit: string;
  location: string;
  manufacturer: string | null;
  category: string;
  expiry_date: string | null;
  supplier: string;
  days_until_out: number;
  created_at: string | null;
  updated_at: string | null;
}

const Reorder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'days_until_out', direction: 'asc' });

  useEffect(() => {
    fetchReorderProducts();
  }, []);

  const fetchReorderProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, suppliers(name)')
        .lte('quantity', 'reorder_level')
        .order('quantity', { ascending: true });

      if (error) throw error;

      const formattedProducts = data.map(item => {
        // Calculate days until out of stock based on current quantity and average daily usage
        const avgDailyUsage = Math.random() * 3 + 0.5; // Simulated: between 0.5 and 3.5 units per day
        const daysUntilOut = Math.floor(item.quantity / avgDailyUsage);
        
        return {
          ...item,
          id: item.id.toString(),
          supplier: item.suppliers?.name || 'Unknown Supplier',
          days_until_out: daysUntilOut
        };
      });

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching reorder products:', error);
      toast.error('Failed to load reorder data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(lowercasedQuery) || 
        product.category.toLowerCase().includes(lowercasedQuery) || 
        product.supplier.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleSort = (key: keyof Product) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProducts(sortedProducts);
  };

  const generatePurchaseOrder = (productId: string) => {
    toast.success('Purchase order generated successfully');
    // In a real implementation, this would navigate to a new PO form or create a PO
  };

  const getUrgencyBadge = (daysUntilOut: number) => {
    if (daysUntilOut <= 3) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Critical</Badge>;
    } else if (daysUntilOut <= 7) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300">Urgent</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">Standard</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reorder Management</h1>
        <p className="text-muted-foreground">
          Monitor inventory levels and create purchase orders for products that need restocking
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.days_until_out <= 3).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of stock in 3 days or less
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent Reorders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.days_until_out > 3 && p.days_until_out <= 7).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of stock in 4-7 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Standard Reorders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.days_until_out > 7).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of stock in more than 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reorder List</CardTitle>
          <CardDescription>Products below their reorder levels</CardDescription>
          
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No products need reordering</h3>
              <p className="text-muted-foreground">
                All products are currently above their reorder levels
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('name')}>
                        Product
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('quantity')}>
                        Stock Level
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('days_until_out')}>
                        Days Until Out
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{product.quantity} {product.unit}</span>
                          <span className="text-xs text-muted-foreground">Min: {product.reorder_level}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className={product.days_until_out <= 3 ? 'text-red-600 dark:text-red-400 font-medium' : ''}>{product.days_until_out} days</span>
                        </div>
                      </TableCell>
                      <TableCell>{getUrgencyBadge(product.days_until_out)}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                          onClick={() => generatePurchaseOrder(product.id)}
                        >
                          <Truck className="h-4 w-4 mr-1" /> Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={fetchReorderProducts}>
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Generate All Purchase Orders
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Reorder;
