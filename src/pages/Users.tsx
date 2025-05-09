
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
import { Eye, Lock, MoreHorizontal, Plus, Search, Settings, Shield, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  reset_password_token: string;
  reset_password_expires: string;
  password: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Convert id from number to string
        const formattedUsers = data.map(user => ({
          ...user,
          id: user.id.toString()
        }));
        
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300">Manager</Badge>;
      case 'pharmacist':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">Pharmacist</Badge>;
      case 'technician':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">Technician</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and access permissions
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role.toLowerCase() === 'admin').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending Reset</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.reset_password_token).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            System users and access rights
          </CardDescription>
          
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users by name, email, or role..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Settings className="h-3.5 w-3.5" />
                <span>Roles</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Permissions</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "No users match your search criteria" : "Add your first user to get started"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.last_login)}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
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
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Change Password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                            {user.is_active ? (
                              <DropdownMenuItem className="text-amber-600 dark:text-amber-400">Deactivate Account</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600 dark:text-green-400">Activate Account</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete Account</DropdownMenuItem>
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

export default UsersPage;
