
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Building, BuildingStore, Mail, Map, MoreHorizontal, Phone, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string | null;
  country: string | null;
  zip_code: string;
  lead_time: number;
  minimum_order_amount: number;
  website: string | null;
  notes: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  product_count: number;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      // Get suppliers with product count
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          product_count:products(count)
        `)
        .order('name');

      if (error) throw error;

      if (data) {
        // Transform the data to convert id from number to string
        const formattedSuppliers = data.map(supplier => ({
          ...supplier,
          id: supplier.id.toString(),
          product_count: supplier.product_count || 0
        }));
        
        setSuppliers(formattedSuppliers);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships and supply chain
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              From {new Set(suppliers.map(s => s.country)).size} countries
            </p>
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
            <p className="text-xs text-muted-foreground">
              With active contracts
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Lead Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.length ? Math.round(suppliers.reduce((acc, curr) => acc + curr.lead_time, 0) / suppliers.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days to deliver orders
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>
            Complete list of your product suppliers
          </CardDescription>
          
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"></div>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-10">
              <Building className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No suppliers found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "No suppliers match your search criteria" : "Add your first supplier to get started"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Supplier</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Lead Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{supplier.name}</span>
                          <span className="text-xs text-muted-foreground">{supplier.website ? supplier.website : "No website"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.product_count}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{supplier.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{supplier.phone_number}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.city}, {supplier.country || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.lead_time} days</TableCell>
                      <TableCell>
                        {supplier.is_active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                        )}
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Products</DropdownMenuItem>
                            <DropdownMenuItem>Create Purchase Order</DropdownMenuItem>
                            <DropdownMenuItem>Contact History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
