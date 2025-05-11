
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Building2, 
  MoreHorizontal, 
  PlusCircle, 
  Search, 
  SlidersHorizontal,
  ArrowUpDown,
  Phone,
  Mail,
  Link,
  MapPin,
  Check,
  X,
  Edit,
  Trash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Supplier {
  id: string;
  name: string;
  contact_name: string;
  email: string;
  phone_number: string;
  address: string;
  website: string;
  category: string;
  is_active: boolean;
  products_count: number;
  created_at: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
    
    // Subscribe to changes
    const channel = supabase
      .channel('public:suppliers')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'suppliers' 
      }, () => {
        loadSuppliers();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      // Fetch suppliers with count of related products
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          products:products(count)
        `);
        
      if (error) throw error;
      
      // Format data with product counts
      const supplierData = data.map(supplier => ({
        ...supplier,
        products_count: supplier.products?.length > 0 ? parseInt(supplier.products[0].count) : 0
      }));
      
      setSuppliers(supplierData as Supplier[]);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleEditSupplier = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setShowEditSupplier(true);
  };
  
  const handleDeleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Supplier deleted successfully");
      loadSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    }
  };
  
  const toggleSupplierStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Supplier ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadSuppliers();
    } catch (error) {
      console.error("Error updating supplier status:", error);
      toast.error("Failed to update supplier status");
    }
  };

  // Function to render the badge with proper styling based on active status
  const renderStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your pharmaceutical suppliers and vendors
          </p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          onClick={() => setShowAddSupplier(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.filter(s => s.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(suppliers.map(s => s.category)).size}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Products Supplied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.reduce((acc, curr) => acc + curr.products_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-card to-muted/50">
        <CardHeader className="pb-3">
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>
            View and manage your pharmaceutical suppliers
          </CardDescription>
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading suppliers...</p>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">No suppliers found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Add a supplier to get started"}
                </p>
                <Button onClick={() => setShowAddSupplier(true)} className="mt-4" variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add your first supplier
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{supplier.name}</span>
                          {supplier.website && (
                            <a 
                              href={supplier.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mt-1"
                            >
                              <Link className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a href={`mailto:${supplier.email}`} className="hover:underline">
                              {supplier.email}
                            </a>
                          </div>
                          {supplier.phone_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a href={`tel:${supplier.phone_number}`} className="hover:underline">
                                {supplier.phone_number}
                              </a>
                            </div>
                          )}
                          {supplier.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{supplier.address}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {supplier.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {supplier.products_count}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(supplier.is_active)}
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
                            <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit supplier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleSupplierStatus(supplier.id, supplier.is_active)}>
                              {supplier.is_active ? (
                                <>
                                  <X className="h-4 w-4 mr-2 text-amber-500" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-2 text-green-500" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier.id)} className="text-red-600 dark:text-red-400">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete supplier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Supplier Dialog would go here */}
      {/* Edit Supplier Dialog would go here */}
    </div>
  );
};

export default Suppliers;
