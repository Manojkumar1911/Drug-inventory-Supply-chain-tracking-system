import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  CircleX, 
  Edit, 
  FileEdit, 
  MoreHorizontal, 
  Package, 
  Plus, 
  Search, 
  Trash2 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientCard } from "@/components/ui/gradient-card";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientButton } from "@/components/ui/gradient-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  contact_person: string;
  is_active: boolean;
  lead_time: number;
  minimum_order_amount: number;
  payment_terms: string;
  notes: string;
  created_at: string;
  updated_at: string;
  website?: string; // Added to fix type error
  category?: string; // Added to fix type error
  products: Array<{
    id: number;
    name: string;
    sku: string;
    price: number;
  }>;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = suppliers.filter(
        supplier => 
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [searchQuery, suppliers]);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          products:products(id, name, sku, price)
        `);

      if (error) {
        throw error;
      }

      setSuppliers(data || []);
      setFilteredSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <GradientHeading as="h1" variant="primary" className="text-3xl font-bold">
            Suppliers
          </GradientHeading>
          <p className="text-muted-foreground">
            Manage your pharmaceutical product suppliers
          </p>
        </div>
        <GradientButton gradientVariant="purple" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </GradientButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <GradientCard variant="purple" className="hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle>Total Suppliers</CardTitle>
            <CardDescription>All registered suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{suppliers.length}</div>
          </CardContent>
        </GradientCard>
        
        <GradientCard variant="blue" className="hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle>Active Suppliers</CardTitle>
            <CardDescription>Currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {suppliers.filter(s => s.is_active).length}
            </div>
          </CardContent>
        </GradientCard>
        
        <GradientCard variant="green" className="hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle>Products Supplied</CardTitle>
            <CardDescription>From all suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {suppliers.reduce((count, supplier) => count + (supplier.products?.length || 0), 0)}
            </div>
          </CardContent>
        </GradientCard>
        
        <GradientCard variant="amber" className="hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle>Avg. Lead Time</CardTitle>
            <CardDescription>In business days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {suppliers.length > 0 
                ? Math.round(suppliers.reduce((sum, s) => sum + s.lead_time, 0) / suppliers.length) 
                : 0}
            </div>
          </CardContent>
        </GradientCard>
      </div>

      <GradientCard variant="slate" className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl">Supplier Directory</CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Suppliers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground">Products</th>
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading suppliers...</p>
                          </td>
                        </tr>
                      ) : filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier) => (
                          <tr key={supplier.id} className="border-t hover:bg-muted/50 transition-colors">
                            <td className="p-3">
                              <div className="font-medium">{supplier.name}</div>
                              {supplier.website && (
                                <div className="text-xs text-muted-foreground">{supplier.website}</div>
                              )}
                              {supplier.category && (
                                <Badge variant="outline" className="mt-1 text-xs">{supplier.category}</Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="text-sm">{supplier.contact_person}</div>
                              <div className="text-xs text-muted-foreground">{supplier.email}</div>
                              <div className="text-xs text-muted-foreground">{supplier.phone_number}</div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-sm">{supplier.products?.length || 0} products</span>
                              </div>
                            </td>
                            <td className="p-3">
                              {supplier.is_active ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                                  <CircleX className="mr-1 h-3 w-3" />
                                  Inactive
                                </Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Supplier
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-8 text-center">
                            <p className="text-muted-foreground">No suppliers found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              {/* Similar table structure for active suppliers */}
              <div className="rounded-md border overflow-hidden">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Active suppliers listing would go here</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              {/* Similar table structure for inactive suppliers */}
              <div className="rounded-md border overflow-hidden">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Inactive suppliers listing would go here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </GradientCard>
    </div>
  );
};

export default Suppliers;
