
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, User, Mail, Phone, Key, Globe, Building, MapPin } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully");
    }, 1500);
  };
  
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password changed successfully");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Personal information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {user?.name?.substring(0, 2) || user?.email?.substring(0, 2) || 'U'}
              </AvatarFallback>
              {/* Use optional chaining for avatar */}
              {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user?.name || "User"} />}
            </Avatar>
            <h3 className="text-lg font-medium">{user?.name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Administrator</span>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Upload Photo
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your account information and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        <User className="h-3.5 w-3.5 mr-1 inline-block" />
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        defaultValue={user?.name || ""} 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="h-3.5 w-3.5 mr-1 inline-block" />
                        Email Address
                      </Label>
                      <Input 
                        id="email" 
                        defaultValue={user?.email || ""} 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="h-3.5 w-3.5 mr-1 inline-block" />
                        Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        defaultValue="555-123-4567" 
                        placeholder="555-123-4567" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">
                        <Building className="h-3.5 w-3.5 mr-1 inline-block" />
                        Job Title
                      </Label>
                      <Input 
                        id="job-title" 
                        defaultValue="Pharmacy Manager" 
                        placeholder="Job Title" 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">
                        <MapPin className="h-3.5 w-3.5 mr-1 inline-block" />
                        Address
                      </Label>
                      <Input 
                        id="address" 
                        defaultValue="123 Main Street, City, State, 12345" 
                        placeholder="Address" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="password">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">
                        <Key className="h-3.5 w-3.5 mr-1 inline-block" />
                        Current Password
                      </Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">
                        <Key className="h-3.5 w-3.5 mr-1 inline-block" />
                        New Password
                      </Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        <Key className="h-3.5 w-3.5 mr-1 inline-block" />
                        Confirm New Password
                      </Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Changing...
                        </>
                      ) : "Change Password"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
