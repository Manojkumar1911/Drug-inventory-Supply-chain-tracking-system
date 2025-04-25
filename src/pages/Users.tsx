
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Edit, 
  PlusCircle, 
  Search, 
  Trash2, 
  Users as UsersIcon,
  UserCheck,
  UserPlus,
  ShieldCheck
} from "lucide-react";

// Mock users data
const userData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@pharmalink.com",
    role: "Admin",
    lastLogin: "2025-04-20T09:30:00",
    isActive: true,
    createdAt: "2025-01-15T00:00:00"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@pharmalink.com",
    role: "Manager",
    lastLogin: "2025-04-24T14:25:00",
    isActive: true,
    createdAt: "2025-01-20T00:00:00"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@pharmalink.com",
    role: "Staff",
    lastLogin: "2025-04-23T11:45:00",
    isActive: true,
    createdAt: "2025-02-01T00:00:00"
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    email: "lisa.r@pharmalink.com",
    role: "Staff",
    lastLogin: "2025-04-24T09:15:00",
    isActive: true,
    createdAt: "2025-02-10T00:00:00"
  },
  {
    id: 5,
    name: "Robert Smith",
    email: "robert.s@pharmalink.com",
    role: "Manager",
    lastLogin: "2025-04-22T16:30:00",
    isActive: false,
    createdAt: "2025-02-15T00:00:00"
  },
  {
    id: 6,
    name: "Emily Wilson",
    email: "emily.w@pharmalink.com",
    role: "Staff",
    lastLogin: "2025-04-18T10:20:00",
    isActive: true,
    createdAt: "2025-03-01T00:00:00"
  }
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = userData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalUsers = userData.length;
  const activeUsers = userData.filter(user => user.isActive).length;
  const adminUsers = userData.filter(user => user.role === "Admin").length;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UsersIcon className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{totalUsers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-success mr-2" />
              <span className="text-2xl font-bold">{activeUsers}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-pharma-600 mr-2" />
              <span className="text-2xl font-bold">{adminUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "Admin" ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200/80 dark:bg-blue-900/30 dark:text-blue-400">
                        Admin
                      </Badge>
                    ) : user.role === "Manager" ? (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200/80 dark:bg-purple-900/30 dark:text-purple-400">
                        Manager
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200/80 dark:bg-gray-900/30 dark:text-gray-400">
                        Staff
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(user.lastLogin)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(user.lastLogin)}</div>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
