
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Search, ShoppingCart, AlertTriangle, Calendar, Tag, ArrowDown } from "lucide-react";

// Define interfaces for our data types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorder_level: number;
  unit: string;
  supplier_id?: string;
  supplier_name?: string;
  cost_price?: number;
}

interface Supplier {
  id: string;
  name: string;
}

interface ReorderItem extends Product {
  selected: boolean;
  order_quantity: number;
}

const Reorder: React.FC = () => {
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<ReorderItem[]>([]);
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [createPODialogOpen, setCreatePODialogOpen] = useState(false);

  useEffect(() => {
    fetchReorderItems();
  }, []);

  const fetchReorderItems = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockSuppliers: Supplier[] = [
        { id: 'sup1', name: 'PharmaMeds Inc.' },
        { id: 'sup2', name: 'MedSupply Co.' },
        { id: 'sup3', name: 'Global Pharmaceuticals' },
        { id: 'sup4', name: 'QuickMeds Distribution' },
      ];
      
      const mockItems: ReorderItem[] = [
        {
          id: 'p1',
          name: 'Amoxicillin 500mg',
          sku: 'AMOX500',
          category: 'Antibiotics',
          quantity: 20,
          reorder_level: 50,
          unit: 'bottle',
          supplier_id: 'sup1',
          supplier_name: 'PharmaMeds Inc.',
          cost_price: 15.75,
          selected: false,
          order_quantity: 50
        },
        {
          id: 'p2',
          name: 'Lisinopril 10mg',
          sku: 'LISP10',
          category: 'Blood Pressure',
          quantity: 15,
          reorder_level: 40,
          unit: 'box',
          supplier_id: 'sup2',
          supplier_name: 'MedSupply Co.',
          cost_price: 12.30,
          selected: false,
          order_quantity: 40
        },
        {
          id: 'p3',
          name: 'Metformin 1000mg',
          sku: 'METF1000',
          category: 'Diabetes',
          quantity: 25,
          reorder_level: 60,
          unit: 'bottle',
          supplier_id: 'sup1',
          supplier_name: 'PharmaMeds Inc.',
          cost_price: 18.50,
          selected: false,
          order_quantity: 60
        },
        {
          id: 'p4',
          name: 'Omeprazole 20mg',
          sku: 'OMEP20',
          category: 'Gastrointestinal',
          quantity: 10,
          reorder_level: 35,
          unit: 'box',
          supplier_id: 'sup3',
          supplier_name: 'Global Pharmaceuticals',
          cost_price: 22.15,
          selected: false,
          order_quantity: 40
        },
        {
          id: 'p5',
          name: 'Levothyroxine 50mcg',
          sku: 'LEVO50',
          category: 'Thyroid',
          quantity: 5,
          reorder_level: 30,
          unit: 'box',
          supplier_id: 'sup4',
          supplier_name: 'QuickMeds Distribution',
          cost_price: 14.80,
          selected: false,
          order_quantity: 40
        },
        {
          id: 'p6',
          name: 'Atorvastatin 20mg',
          sku: 'ATOR20',
          category: 'Cholesterol',
          quantity: 18,
          reorder_level: 45,
          unit: 'bottle',
          supplier_id: 'sup2',
          supplier_name: 'MedSupply Co.',
          cost_price: 24.99,
          selected: false,
          order_quantity: 45
        },
      ];
      
      setReorderItems(mockItems);
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Failed to fetch reorder items:", error);
      toast.error("Failed to load reorder items");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCheckboxChange = (id: string) => {
    setReorderItems(items => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });
    });
    
    // Update selected items
    const updatedItems = reorderItems.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    setSelectedItems(updatedItems.filter(item => item.selected));
  };
  
  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 0) return;
    
    setReorderItems(items => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, order_quantity: quantity };
        }
        return item;
      });
    });
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    
    setReorderItems(items => {
      return items.map(item => {
        if (supplierFilter === 'all' || item.supplier_id === supplierFilter) {
          return { ...item, selected: checked };
        }
        return item;
      });
    });
    
    // Update selected items
    if (checked) {
      const filtered = reorderItems.filter(item => 
        (supplierFilter === 'all' || item.supplier_id === supplierFilter)
      );
      setSelectedItems(filtered);
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleCreatePO = () => {
    const selected = reorderItems.filter(item => item.selected);
    if (selected.length === 0) {
      toast.error("Please select at least one item to reorder");
      return;
    }
    
    // Group by supplier
    const supplierGroups = selected.reduce((groups: Record<string, ReorderItem[]>, item) => {
      const supplierId = item.supplier_id || 'unknown';
      if (!groups[supplierId]) {
        groups[supplierId] = [];
      }
      groups[supplierId].push(item);
      return groups;
    }, {});
    
    // Create purchase orders (in a real app, this would call an API)
    const poNumbers: string[] = [];
    
    Object.entries(supplierGroups).forEach(([supplierId, items]) => {
      const supplierName = items[0].supplier_name || 'Unknown Supplier';
      const poNumber = `PO-${Date.now().toString().slice(-6)}`;
      poNumbers.push(poNumber);
      
      // In a real app, this would be an API call to create the PO
      console.log(`Created PO ${poNumber} for ${supplierName} with ${items.length} items`);
    });
    
    // Close dialog and show success message
    setCreatePODialogOpen(false);
    toast.success(`Created ${poNumbers.length} purchase orders successfully`);
    
    // Reset selections
    setReorderItems(items => items.map(item => ({ ...item, selected: false })));
    setSelectedItems([]);
  };

  // Filter items based on search query and supplier filter
  const filteredItems = reorderItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || item.supplier_id === supplierFilter;
    
    return matchesSearch && matchesSupplier;
  });

  // Calculate metrics for the summary
  const itemsCount = filteredItems.length;
  const selectedCount = selectedItems.length;
  const totalValue = selectedItems.reduce((sum, item) => {
    return sum + (item.cost_price || 0) * item.order_quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reorder Management</h1>
          <p className="text-muted-foreground">
            View and manage products that need to be reordered
          </p>
        </div>
        
        <Dialog open={createPODialogOpen} onOpenChange={setCreatePODialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex gap-2" 
              disabled={selectedItems.length === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              Create Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">Order Summary</h3>
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Quantity:</span>
                    <span className="font-medium">
                      {selectedItems.reduce((sum, item) => sum + item.order_quantity, 0)} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">
                      ${totalValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suppliers:</span>
                    <span className="font-medium">
                      {new Set(selectedItems.map(item => item.supplier_name)).size}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Supplier Breakdown</h3>
                <div className="space-y-2">
                  {Array.from(
                    selectedItems.reduce((acc, item) => {
                      const supplierId = item.supplier_id || 'unknown';
                      if (!acc.has(supplierId)) {
                        acc.set(supplierId, {
                          name: item.supplier_name || 'Unknown Supplier',
                          items: [],
                          total: 0
                        });
                      }
                      acc.get(supplierId)?.items.push(item);
                      acc.get(supplierId)!.total += (item.cost_price || 0) * item.order_quantity;
                      return acc;
                    }, new Map())
                  ).map(([supplierId, data]) => (
                    <div key={supplierId} className="border rounded-md p-3">
                      <div className="font-medium">{data.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.items.length} items, ${data.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreatePODialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePO}>
                Confirm & Create PO
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Items Below Reorder Level</CardTitle>
          <CardDescription>
            Products that have fallen below their reorder thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="flex gap-2 items-center">
              <label htmlFor="supplier-filter" className="text-sm font-medium">
                Filter by supplier:
              </label>
              <select 
                id="supplier-filter"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No items to reorder</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || supplierFilter !== 'all' ? 
                    'Try adjusting your filters' : 
                    'All products are above their reorder levels'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox onChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Qty</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Order Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="w-12">
                        <Checkbox 
                          checked={item.selected}
                          onCheckedChange={() => handleCheckboxChange(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{item.sku}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={`font-medium ${item.quantity < item.reorder_level / 2 ? "text-destructive" : "text-amber-500"}`}>
                            {item.quantity}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {item.unit}
                          </span>
                        </div>
                        {item.quantity < item.reorder_level / 2 && (
                          <div className="flex items-center text-xs text-destructive gap-1 mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Critical</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{item.reorder_level}</span>
                          <ArrowDown className={`h-3.5 w-3.5 ${item.quantity < item.reorder_level / 2 ? "text-destructive" : "text-amber-500"}`} />
                        </div>
                      </TableCell>
                      <TableCell>{item.supplier_name}</TableCell>
                      <TableCell>${item.cost_price?.toFixed(2) || "N/A"}</TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          min={1}
                          value={item.order_quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          
          {filteredItems.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {selectedCount === 0 ? (
                  `${itemsCount} items need to be reordered`
                ) : (
                  `${selectedCount} of ${itemsCount} items selected`
                )}
              </div>
              <div className="flex items-center gap-3">
                {selectedCount > 0 && (
                  <div className="text-sm font-medium">
                    Total Value: ${totalValue.toFixed(2)}
                  </div>
                )}
                <Button 
                  size="sm" 
                  onClick={() => setCreatePODialogOpen(true)}
                  disabled={selectedCount === 0}
                >
                  Create Purchase Order
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reorder;
