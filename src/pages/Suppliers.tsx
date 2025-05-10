
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Building2, Phone, Mail, MapPin, Plus, Search, Package, Clock, DollarSign, Edit, Trash } from "lucide-react";

// Define supplier interface
interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  zip_code: string;
  website?: string;
  lead_time: number;
  minimum_order_amount: number;
  notes?: string;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  product_count?: number | { count: number }[];
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    website: '',
    lead_time: 7,
    minimum_order_amount: 0,
    notes: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      // Simulated API call - in a real app this would be a backend API call
      // This creates mock suppliers for demo purposes
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'PharmaMeds Inc.',
          contact_person: 'John Smith',
          email: 'john@pharmameds.com',
          phone_number: '555-123-4567',
          address: '123 Medicine Ave',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zip_code: '94105',
          website: 'www.pharmameds.com',
          lead_time: 3,
          minimum_order_amount: 500,
          notes: 'Preferred supplier for antibiotics',
          is_active: true,
          created_at: '2023-01-15',
          updated_at: '2023-05-20',
          product_count: 24
        },
        {
          id: '2',
          name: 'MedSupply Co.',
          contact_person: 'Sarah Johnson',
          email: 'sarah@medsupply.com',
          phone_number: '555-987-6543',
          address: '456 Health Blvd',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          zip_code: '60601',
          website: 'www.medsupply.com',
          lead_time: 5,
          minimum_order_amount: 250,
          notes: 'Reliable for emergency orders',
          is_active: true,
          created_at: '2023-02-10',
          updated_at: '2023-06-15',
          product_count: 18
        },
        {
          id: '3',
          name: 'Global Pharmaceuticals',
          contact_person: 'Robert Chen',
          email: 'robert@globalpharma.com',
          phone_number: '555-456-7890',
          address: '789 Research Dr',
          city: 'Boston',
          state: 'MA',
          country: 'USA',
          zip_code: '02110',
          website: 'www.globalpharma.com',
          lead_time: 7,
          minimum_order_amount: 1000,
          notes: 'Specializes in rare medications',
          is_active: true,
          created_at: '2023-03-05',
          updated_at: '2023-07-10',
          product_count: 32
        },
        {
          id: '4',
          name: 'QuickMeds Distribution',
          contact_person: 'Lisa Wong',
          email: 'lisa@quickmeds.com',
          phone_number: '555-789-0123',
          address: '101 Delivery Lane',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          zip_code: '80202',
          website: 'www.quickmeds.com',
          lead_time: 2,
          minimum_order_amount: 100,
          notes: 'Fastest delivery times',
          is_active: true,
          created_at: '2023-04-20',
          updated_at: '2023-08-05',
          product_count: 15
        },
        {
          id: '5',
          name: 'Horizon Healthcare',
          contact_person: 'Michael Brown',
          email: 'michael@horizonhealth.com',
          phone_number: '555-234-5678',
          address: '202 Wellness Way',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zip_code: '98101',
          website: 'www.horizonhealth.com',
          lead_time: 4,
          minimum_order_amount: 300,
          notes: 'Good bulk discounts available',
          is_active: false,
          created_at: '2023-05-12',
          updated_at: '2023-09-01',
          product_count: 27
        }
      ];
      
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'lead_time' || name === 'minimum_order_amount' 
        ? parseFloat(value) 
        : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentSupplier) {
        // Update existing supplier
        const updatedSupplier = {
          ...currentSupplier,
          ...formData,
          updated_at: new Date().toISOString()
        };
        
        // In a real app, you would make an API call here
        // await updateSupplier(updatedSupplier);
        
        // Update local state
        setSuppliers(suppliers.map(s => s.id === currentSupplier.id ? updatedSupplier : s));
        toast.success("Supplier updated successfully");
      } else {
        // Create new supplier
        const newSupplier: Supplier = {
          ...formData,
          id: `new-${Date.now()}`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          product_count: 0
        };
        
        // In a real app, you would make an API call here
        // await createSupplier(newSupplier);
        
        // Update local state
        setSuppliers([...suppliers, newSupplier]);
        toast.success("Supplier added successfully");
      }
      
      // Reset form and close dialog
      resetForm();
    } catch (error) {
      console.error("Error saving supplier:", error);
      toast.error(currentSupplier ? "Failed to update supplier" : "Failed to add supplier");
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone_number: supplier.phone_number,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state || '',
      country: supplier.country || '',
      zip_code: supplier.zip_code,
      website: supplier.website || '',
      lead_time: supplier.lead_time,
      minimum_order_amount: supplier.minimum_order_amount,
      notes: supplier.notes || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        // In a real app, you would make an API call here
        // await deleteSupplier(id);
        
        // Update local state
        setSuppliers(suppliers.filter(s => s.id !== id));
        toast.success("Supplier deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Failed to delete supplier");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_person: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      website: '',
      lead_time: 7,
      minimum_order_amount: 0,
      notes: ''
    });
    setCurrentSupplier(null);
    setOpenDialog(false);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your product suppliers and vendor relationships
          </p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Company Name</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Company name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contact_person" className="text-sm font-medium">Contact Person</label>
                  <Input 
                    id="contact_person" 
                    name="contact_person" 
                    value={formData.contact_person} 
                    onChange={handleInputChange} 
                    placeholder="Full name" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="Email address" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="text-sm font-medium">Phone Number</label>
                  <Input 
                    id="phone_number" 
                    name="phone_number" 
                    value={formData.phone_number} 
                    onChange={handleInputChange} 
                    placeholder="Phone number" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Street address" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="City" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State</label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    placeholder="State/Province" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="zip_code" className="text-sm font-medium">ZIP Code</label>
                  <Input 
                    id="zip_code" 
                    name="zip_code" 
                    value={formData.zip_code} 
                    onChange={handleInputChange} 
                    placeholder="ZIP/Postal code" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <Input 
                    id="country" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    placeholder="Country" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">Website</label>
                  <Input 
                    id="website" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleInputChange} 
                    placeholder="Website URL" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="lead_time" className="text-sm font-medium">Lead Time (days)</label>
                  <Input 
                    id="lead_time" 
                    name="lead_time" 
                    type="number" 
                    value={formData.lead_time} 
                    onChange={handleInputChange} 
                    min="1" 
                    placeholder="Lead time in days" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="minimum_order_amount" className="text-sm font-medium">Minimum Order ($)</label>
                  <Input 
                    id="minimum_order_amount" 
                    name="minimum_order_amount" 
                    type="number" 
                    value={formData.minimum_order_amount} 
                    onChange={handleInputChange} 
                    min="0" 
                    placeholder="Minimum order amount" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                <Input 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange} 
                  placeholder="Additional notes" 
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{currentSupplier ? 'Update Supplier' : 'Add Supplier'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Supplier Directory</CardTitle>
            <div className="relative w-64">
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
          <CardDescription>
            Manage your suppliers, view their product catalogs, and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No suppliers found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {supplier.website}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm">{supplier.contact_person}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {supplier.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {supplier.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {supplier.city}, {supplier.state || ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {typeof supplier.product_count === 'number' 
                              ? supplier.product_count 
                              : Array.isArray(supplier.product_count) 
                                ? supplier.product_count.length > 0 
                                  ? 'count' in supplier.product_count[0] 
                                    ? supplier.product_count[0].count 
                                    : 0 
                                  : 0 
                                : 0} items
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{supplier.lead_time} days</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>${supplier.minimum_order_amount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.is_active ? "success" : "secondary"}>
                          {supplier.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                            <Edit className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(supplier.id)}>
                            <Trash className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;
