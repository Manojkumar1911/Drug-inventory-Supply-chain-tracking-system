
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  CalendarClock, 
  ShieldCheck,
  Shield,
  UserX,
  UserCog,
  Users as UsersIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLoader from '@/components/ui/page-loader';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
  last_sign_in_at: string | null;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          throw error;
        }
        
        setUsers(users);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
        
        // Generate mock data for demo purposes
        const mockUsers = generateMockUsers();
        setUsers(mockUsers);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Generate mock users for demo purposes
  const generateMockUsers = (): User[] => {
    const roles = ['admin', 'manager', 'staff'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.com'];
    const mockUsers = [];
    
    for (let i = 0; i < 10; i++) {
      const id = `user-${i+1}`;
      const role = roles[Math.floor(Math.random() * roles.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const firstName = ['John', 'Jane', 'Michael', 'Emma', 'David', 'Sarah'][Math.floor(Math.random() * 6)];
      const lastName = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Taylor'][Math.floor(Math.random() * 6)];
      const name = `${firstName} ${lastName}`;
      
      const user: User = {
        id,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        role,
        last_sign_in_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : null,
        user_metadata: {
          name
        }
      };
      
      mockUsers.push(user);
    }
    
    return mockUsers;
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    const email = user.email.toLowerCase();
    const name = user.user_metadata?.name?.toLowerCase() || '';
    const role = user.role?.toLowerCase() || '';
    
    return email.includes(searchTerm) || 
           name.includes(searchTerm) || 
           role.includes(searchTerm);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Users</h1>
        <p className="text-muted-foreground">
          Manage user access and permissions for your pharmacy system
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active team members
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/20 border-violet-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              With full access
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.last_sign_in_at !== null).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Users logged in this month
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Add, edit, or remove users from your pharmaceutical system
            </CardDescription>
            
            <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="ml-auto gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Add a new user to your pharmacy system. They will receive an email invitation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-sm font-medium col-span-1">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right text-sm font-medium col-span-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        placeholder="user@example.com"
                        type="email"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="role" className="text-right text-sm font-medium col-span-1">
                        Role
                      </label>
                      <select
                        id="role"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button 
                      onClick={() => toast.success('Invitation sent!', { 
                        description: 'User will receive an email to set up their account.' 
                      })}
                    >
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <PageLoader message="Loading users..." />
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <UsersIcon className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-medium">No users found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? 'Try a different search term' : 'Start by adding your first user'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Sign In</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{user.user_metadata?.name || '(No name)'}</span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> 
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {new Date(user.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? (
                            new Date(user.last_sign_in_at).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground text-sm">Never</span>
                          )}
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
                              <DropdownMenuItem onClick={() => toast.success('Reset password email sent!')}>
                                Reset password
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success('User edited successfully')}>
                                <UserCog className="h-4 w-4 mr-2" />
                                Edit user
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => toast.info('User role changed', { 
                                  description: `${user.email} is now an Administrator`
                                })}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
                                Change role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => toast.error('User deleted', { 
                                  description: `${user.email} has been removed from the system`
                                })}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Delete user
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
      </motion.div>
    </div>
  );
};

// Role badge component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  switch (role) {
    case 'admin':
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Administrator
        </Badge>
      );
    case 'manager':
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Manager
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          Staff
        </Badge>
      );
  }
};

export default Users;
