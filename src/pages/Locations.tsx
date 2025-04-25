
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Building, 
  Map, 
  ChevronRight, 
  AlertCircle 
} from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  phone: string;
  status: "active" | "inactive";
  productCount: number;
}

const Locations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data
  const locations: Location[] = [
    { 
      id: "1", 
      name: "Main Pharmacy", 
      type: "Retail", 
      address: "123 Main Street", 
      city: "Boston", 
      state: "MA", 
      zipCode: "02108", 
      contactPerson: "John Smith", 
      phone: "(617) 555-1234", 
      status: "active",
      productCount: 458
    },
    { 
      id: "2", 
      name: "Downtown Branch", 
      type: "Retail", 
      address: "45 Market Street", 
      city: "Boston", 
      state: "MA", 
      zipCode: "02109", 
      contactPerson: "Jane Doe", 
      phone: "(617) 555-2345", 
      status: "active",
      productCount: 325
    },
    { 
      id: "3", 
      name: "Central Warehouse", 
      type: "Warehouse", 
      address: "789 Industrial Park", 
      city: "Waltham", 
      state: "MA", 
      zipCode: "02452", 
      contactPerson: "Robert Johnson", 
      phone: "(781) 555-3456", 
      status: "active",
      productCount: 1245
    },
    { 
      id: "4", 
      name: "Cambridge Branch", 
      type: "Retail", 
      address: "567 Harvard Square", 
      city: "Cambridge", 
      state: "MA", 
      zipCode: "02138", 
      contactPerson: "Susan Wilson", 
      phone: "(617) 555-4567", 
      status: "inactive",
      productCount: 0
    },
  ];

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Locations</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Location
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{locations.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-success mr-2" />
              <span className="text-2xl font-bold">
                {locations.filter(l => l.status === "active").length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products Across Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Map className="h-5 w-5 text-pharma-600 mr-2" />
              <span className="text-2xl font-bold">
                {locations.reduce((sum, location) => sum + location.productCount, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Manage Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.type}</TableCell>
                  <TableCell>
                    {location.address}, {location.city}, {location.state} {location.zipCode}
                  </TableCell>
                  <TableCell>
                    <div>{location.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{location.phone}</div>
                  </TableCell>
                  <TableCell>
                    {location.status === "active" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredLocations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-muted p-3">
                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium">No locations found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search query
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Locations;
