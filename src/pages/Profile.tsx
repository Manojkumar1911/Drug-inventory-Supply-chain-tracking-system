
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Building, Calendar, Mail, Phone, Shield, User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const userInitials = user?.name ? user.name.substring(0, 2) : 'JD';
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@pharmalink.com",
    title: "Inventory Manager",
    department: "Operations",
    phone: "(617) 555-1234",
    location: "Boston Branch",
    joinDate: "January 15, 2025"
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password validation
  const [passwordError, setPasswordError] = useState("");
  
  const validatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    
    setPasswordError("");
    return true;
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };
  
  const saveProfile = () => {
    toast.success("Profile updated successfully");
  };
  
  const changePassword = () => {
    if (validatePassword()) {
      // Here you would make an API call to change the password
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(passwordError);
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="text-2xl bg-pharma-100 text-pharma-600">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h3 className="text-lg font-bold">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{profileData.title}</p>
              
              <div className="flex items-center justify-center gap-1 mb-4">
                <BadgeCheck className="h-4 w-4 text-pharma-600" />
                <span className="text-xs">Verified Account</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profileData.department}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Joined {profileData.joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Update your profile details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={profileData.name} 
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title"
                      name="title"
                      value={profileData.title} 
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      name="department"
                      value={profileData.department} 
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={profileData.phone} 
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location"
                      name="location"
                      value={profileData.location} 
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <Button className="mt-2" onClick={saveProfile}>Save Changes</Button>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password"
                    name="currentPassword"
                    type="password" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password"
                    name="newPassword"
                    type="password" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password"
                    name="confirmPassword"
                    type="password" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>
                
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
                
                <Button className="mt-2" onClick={changePassword}>Change Password</Button>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
