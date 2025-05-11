
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  PackageOpen,
  Search,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash,
  ToggleRight,
  ToggleLeft,
  Truck,
  ArrowLeftRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLoader from '@/components/ui/page-loader';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  is_active: boolean;
  manager: string;
  staff_count: number;
  product_count: number;
  type: 'warehouse' | 'retail' | 'distribution';
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Pharmacy',
    address: '123 Healthcare Ave',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94105',
    phone: '(415) 555-1234',
    is_active: true,
    manager: 'Dr. Sarah Johnson',
    staff_count: 12,
    product_count: 2358,
    type: 'retail'
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: '456 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip_code: '94102',
    phone: '(415) 555-5678',
    is_active: true,
    manager: 'Dr. Michael Chen',
    staff_count: 8,
    product_count: 1947,
    type: 'retail'
  },
  {
    id: '3',
    name: 'Central Warehouse',
    address: '789 Industrial Pkwy',
    city: 'Oakland',
    state: 'CA',
    zip_code: '94621',
    phone: '(510) 555-9012',
    is_active: true,
    manager: 'Robert Miller',
    staff_count: 18,
    product_count: 8795,
    type: 'warehouse'
  },
  {
    id: '4',
    name: 'South Bay Distribution',
    address: '101 Tech Drive',
    city: 'San Jose',
    state: 'CA',
    zip_code: '95110',
    phone: '(408) 555-3456',
    is_active: true,
    manager: 'Jennifer Wilson',
    staff_count: 15,
    product_count: 6240,
    type: 'distribution'
  },
  {
    id: '5',
    name: 'Berkeley Location',
    address: '202 University Ave',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94704',
    phone: '(510) 555-7890',
    is_active: false,
    manager: 'David Thompson',
    staff_count: 0,
    product_count: 0,
    type: 'retail'
  }
];

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load locations from Supabase or fallback to mock data
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Map data from Supabase to our Location interface
          const mappedLocations = data.map((location: any) => ({
            ...location,
            staff_count: location.staff_count || Math.floor(Math.random() * 20) + 2,
            product_count: location.product_count || Math.floor(Math.random() * 5000) + 500
          }));
          setLocations(mappedLocations);
        } else {
          // Use mock data as fallback
          setLocations(mockLocations);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
        toast.error('Failed to load locations');
        setLocations(mockLocations); // Use mock data on error
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredLocations = locations.filter(location => {
    const searchTerm = searchQuery.toLowerCase();
    return location.name.toLowerCase().includes(searchTerm) ||
           location.address.toLowerCase().includes(searchTerm) ||
           location.city.toLowerCase().includes(searchTerm) ||
           location.state.toLowerCase().includes(searchTerm) ||
           location.zip_code.toLowerCase().includes(searchTerm) ||
           location.type.toLowerCase().includes(searchTerm);
  });
  
  const activeLocations = locations.filter(loc => loc.is_active);
  const totalProducts = locations.reduce((sum, loc) => sum + loc.product_count, 0);
  const totalStaff = locations.reduce((sum, loc) => sum + loc.staff_count, 0);
  
  const getLocationTypeBadge = (type: string) => {
    switch (type) {
      case 'warehouse':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
            <PackageOpen className="h-3 w-3" />
            Warehouse
          </Badge>
        );
      case 'distribution':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Distribution Center
          </Badge>
        );
      case 'retail':
      default:
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Retail Location
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Locations</h1>
        <p className="text-muted-foreground">
          Manage your pharmacy locations and warehouses
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeLocations.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retail Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter(loc => loc.type === 'retail').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {locations.filter(loc => loc.type === 'retail' && loc.is_active).length} active
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all locations
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Team members
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>All Locations</CardTitle>
            <CardDescription>
              Manage your pharmacy locations and inventory sites
            </CardDescription>
            
            <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search locations..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Button
                className="ml-auto gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                onClick={() => toast.success('Location added successfully!')}
              >
                <PlusCircle className="h-4 w-4" />
                Add Location
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <PageLoader message="Loading locations..." />
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Building2 className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-medium">No locations found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'Start by adding your first location'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="font-medium">{location.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> 
                              {location.address}, {location.city}, {location.state} {location.zip_code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getLocationTypeBadge(location.type)}
                        </TableCell>
                        <TableCell>
                          {location.is_active ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {location.phone}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Users className="h-3 w-3" />
                              {location.staff_count} staff
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{location.product_count.toLocaleString()} products</span>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full" 
                                style={{ width: '75%' }} 
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => toast.success('Location details opened')}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('Location edited successfully')}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit location
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => toast.success(`Location ${location.is_active ? 'deactivated' : 'activated'}`)}
                              >
                                {location.is_active ? (
                                  <>
                                    <ToggleLeft className="h-4 w-4 mr-2 text-amber-500" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="h-4 w-4 mr-2 text-green-500" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('Transfer initiated')}>
                                <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-500" />
                                Transfer Inventory
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => toast.error('Location deleted')}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete location
                              </DropdownMenuItem>
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

        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
            <CardDescription>
              Geographic distribution of your locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25299.40305997207!2d-122.2663207237422!3d37.8708684183182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808579363a8549d3%3A0x94ea1595a675e993!2sBerkeley%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1677788363571!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                className="border-0"
                allowFullScreen={false} 
                loading="lazy"
                title="Location Map"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="w-full">
              View Full Map
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Locations;
