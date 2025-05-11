
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Map,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  latitude?: number;
  longitude?: number;
}

interface NewLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  manager: string;
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
    type: 'retail',
    latitude: 37.78825,
    longitude: -122.4324
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
    type: 'retail',
    latitude: 37.7897,
    longitude: -122.4000
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
    type: 'warehouse',
    latitude: 37.7548,
    longitude: -122.1921
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
    type: 'distribution',
    latitude: 37.3387,
    longitude: -121.8853
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
    type: 'retail',
    latitude: 37.8716,
    longitude: -122.2727
  }
];

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState<NewLocation>({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    manager: '',
    type: 'retail'
  });

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
            id: String(location.id),
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

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would add data to Supabase
      const newLocationEntry: Location = {
        id: `loc-${Date.now()}`,
        ...newLocation,
        is_active: true,
        staff_count: 0,
        product_count: 0
      };
      
      setLocations([...locations, newLocationEntry]);
      setShowAddLocation(false);
      setNewLocation({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        manager: '',
        type: 'retail'
      });
      
      toast.success('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Failed to add location');
    }
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowEditLocation(true);
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;
    
    try {
      // In a real app, this would update data in Supabase
      const updatedLocations = locations.map(location => 
        location.id === selectedLocation.id ? selectedLocation : location
      );
      
      setLocations(updatedLocations);
      setShowEditLocation(false);
      setSelectedLocation(null);
      
      toast.success('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location');
    }
  };

  const handleDeleteLocation = (locationId: string) => {
    try {
      // In a real app, this would delete data from Supabase
      const updatedLocations = locations.filter(location => location.id !== locationId);
      setLocations(updatedLocations);
      
      toast.error('Location deleted', {
        description: 'The location has been removed from the system'
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const toggleLocationStatus = (locationId: string, currentStatus: boolean) => {
    try {
      // In a real app, this would update data in Supabase
      const updatedLocations = locations.map(location => {
        if (location.id === locationId) {
          return { ...location, is_active: !currentStatus };
        }
        return location;
      });
      
      setLocations(updatedLocations);
      
      toast.success(`Location ${currentStatus ? 'deactivated' : 'activated'}`);
    } catch (error) {
      console.error('Error toggling location status:', error);
      toast.error('Failed to update location status');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isEdit = false) => {
    const { name, value } = e.target;
    
    if (isEdit && selectedLocation) {
      setSelectedLocation({
        ...selectedLocation,
        [name]: value
      });
    } else {
      setNewLocation({
        ...newLocation,
        [name]: value
      });
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 shadow-glow-blue/5 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-4 w-4 text-blue-500" /> Total Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeLocations.length} active
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200/50 shadow-glow-green/5 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-4 w-4 text-emerald-500" /> Retail Locations
            </CardTitle>
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
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50 shadow-glow-yellow/5 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <PackageOpen className="h-4 w-4 text-amber-500" /> Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all locations
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 shadow-glow-purple/5 hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-500" /> Staff
            </CardTitle>
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
        <Card className="md:col-span-2 bg-gradient-to-br from-card to-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">All Locations</CardTitle>
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
                className="ml-auto gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 btn-hover-glow"
                onClick={() => setShowAddLocation(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Location
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
                <p className="text-muted-foreground">Loading locations...</p>
              </div>
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
                                className={`h-1 rounded-full ${
                                  location.product_count > 5000 
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                                }`}
                                style={{ width: `${Math.min(location.product_count / 100, 100)}%` }} 
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/80">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditLocation(location)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit location
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => toggleLocationStatus(location.id, location.is_active)}
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
                                onClick={() => handleDeleteLocation(location.id)}
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

        <Card className="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-900/20 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Location Map
            </CardTitle>
            <CardDescription>
              Geographic distribution of your locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-md flex items-center justify-center overflow-hidden shadow-inner border border-muted">
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
            
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Location Statistics</h4>
              <ul className="space-y-2 text-sm">
                {['CA', 'NY', 'TX'].map((state) => (
                  <li key={state} className="flex justify-between items-center">
                    <span>{state}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 bg-gradient-to-r ${
                            state === 'CA' 
                              ? 'from-blue-400 to-blue-600 w-3/4' 
                              : state === 'NY'
                                ? 'from-purple-400 to-purple-600 w-1/2'
                                : 'from-green-400 to-green-600 w-1/4'
                          }`}
                        />
                      </div>
                    </div>
                    <span className="font-medium">
                      {state === 'CA' ? '75%' : state === 'NY' ? '50%' : '25%'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" className="flex-1">
              <Map className="h-4 w-4 mr-2" />
              View Full Map
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 ml-2">
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Add Location Dialog */}
      <Dialog open={showAddLocation} onOpenChange={setShowAddLocation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Add a new pharmacy location or warehouse to your inventory system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLocation}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={newLocation.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="address" className="text-right text-sm font-medium">Address</label>
                <Input
                  id="address"
                  name="address"
                  value={newLocation.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="city" className="text-right text-sm font-medium">City</label>
                <Input
                  id="city"
                  name="city"
                  value={newLocation.city}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="state" className="text-right text-sm font-medium">State</label>
                <Input
                  id="state"
                  name="state"
                  value={newLocation.state}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="zip_code" className="text-right text-sm font-medium">ZIP Code</label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={newLocation.zip_code}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right text-sm font-medium">Phone</label>
                <Input
                  id="phone"
                  name="phone"
                  value={newLocation.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="manager" className="text-right text-sm font-medium">Manager</label>
                <Input
                  id="manager"
                  name="manager"
                  value={newLocation.manager}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right text-sm font-medium">Type</label>
                <select
                  id="type"
                  name="type"
                  value={newLocation.type}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="retail">Retail Location</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="distribution">Distribution Center</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddLocation(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">Add Location</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={showEditLocation} onOpenChange={setShowEditLocation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Update location information in your inventory system.
            </DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <form onSubmit={handleUpdateLocation}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-name" className="text-right text-sm font-medium">Name</label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={selectedLocation.name}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-address" className="text-right text-sm font-medium">Address</label>
                  <Input
                    id="edit-address"
                    name="address"
                    value={selectedLocation.address}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-city" className="text-right text-sm font-medium">City</label>
                  <Input
                    id="edit-city"
                    name="city"
                    value={selectedLocation.city}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-state" className="text-right text-sm font-medium">State</label>
                  <Input
                    id="edit-state"
                    name="state"
                    value={selectedLocation.state}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-zip_code" className="text-right text-sm font-medium">ZIP Code</label>
                  <Input
                    id="edit-zip_code"
                    name="zip_code"
                    value={selectedLocation.zip_code}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-phone" className="text-right text-sm font-medium">Phone</label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={selectedLocation.phone}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-manager" className="text-right text-sm font-medium">Manager</label>
                  <Input
                    id="edit-manager"
                    name="manager"
                    value={selectedLocation.manager}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-type" className="text-right text-sm font-medium">Type</label>
                  <select
                    id="edit-type"
                    name="type"
                    value={selectedLocation.type}
                    onChange={(e) => handleInputChange(e, true)}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="retail">Retail Location</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="distribution">Distribution Center</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditLocation(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">Update Location</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locations;
