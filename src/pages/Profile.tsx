
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Check, User, Mail, Building, Shield } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || 'User',
    email: user?.email || '',
    job_title: user?.user_metadata?.job_title || 'Pharmacy Manager',
    department: user?.user_metadata?.department || 'Pharmacy',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would update the user profile in your backend
      // For now, we just simulate a successful update
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.user_metadata?.full_name || 'User',
      email: user?.email || '',
      job_title: user?.user_metadata?.job_title || 'Pharmacy Manager',
      department: user?.user_metadata?.department || 'Pharmacy',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt={profileData.name} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.name}</span>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="job_title">Job Title</Label>
                {isEditing ? (
                  <Input
                    id="job_title"
                    name="job_title"
                    value={profileData.job_title}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.job_title}</span>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.department}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Your password was last changed 30 days ago
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Login Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  You are currently logged in on one device
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Enable Two-Factor Auth
            </Button>
            <Button variant="destructive" className="w-full">
              Sign Out All Devices
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
