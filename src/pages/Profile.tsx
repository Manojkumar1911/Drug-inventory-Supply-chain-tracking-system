
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Save, 
  Clock, 
  Lock, 
  AlertTriangle, 
  Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const Profile = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@pharmalink.com",
    jobTitle: "Pharmacy Manager",
    phone: "(617) 555-1234",
    location: "Main Pharmacy",
    address: "123 Main St, Boston, MA 02108",
    bio: "Experienced pharmacy manager with over 10 years in pharmaceutical inventory management. Specializing in supply chain optimization and regulatory compliance.",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const activities: Activity[] = [
    {
      id: "1",
      type: "login",
      description: "Logged in from Boston, MA",
      timestamp: "April 16, 2025 at 9:32 AM",
    },
    {
      id: "2",
      type: "inventory",
      description: "Updated inventory for Paracetamol",
      timestamp: "April 15, 2025 at 3:45 PM",
    },
    {
      id: "3",
      type: "transfer",
      description: "Created transfer #TRF-2025-042",
      timestamp: "April 15, 2025 at 2:20 PM",
    },
    {
      id: "4",
      type: "login",
      description: "Logged in from Boston, MA",
      timestamp: "April 15, 2025 at 8:45 AM",
    },
    {
      id: "5",
      type: "settings",
      description: "Updated notification preferences",
      timestamp: "April 14, 2025 at 4:12 PM",
    },
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (securityForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    toast.success("Password updated successfully");
    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <User className="h-4 w-4 text-blue-500" />;
      case "inventory":
        return <Building className="h-4 w-4 text-green-500" />;
      case "transfer":
        return <MapPin className="h-4 w-4 text-orange-500" />;
      case "settings":
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{profile.jobTitle}</p>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Active
              </Badge>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{profile.address}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="w-full">
                <h3 className="text-sm font-medium mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground text-left">
                  {profile.bio}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View All Activities
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Profile Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profile.name} 
                          onChange={e => setProfile({...profile, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          onChange={e => setProfile({...profile, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input 
                          id="job-title" 
                          value={profile.jobTitle} 
                          onChange={e => setProfile({...profile, jobTitle: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.phone} 
                          onChange={e => setProfile({...profile, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={profile.location} 
                          onChange={e => setProfile({...profile, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={profile.address} 
                          onChange={e => setProfile({...profile, address: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="h-20"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSecuritySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={securityForm.currentPassword}
                        onChange={e => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={securityForm.newPassword}
                          onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={securityForm.confirmPassword}
                          onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Update Password
                      </Button>
                    </div>
                  </form>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-md border p-3">
                        <div className="mt-0.5">
                          <Shield className="h-5 w-5 text-success" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Current Session</p>
                            <Badge className="text-xs bg-green-500">Active</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Boston, MA • Chrome on macOS</p>
                          <p className="text-xs text-muted-foreground">Started April 16, 2025 at 9:32 AM</p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            End Session
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 rounded-md border p-3">
                        <div className="mt-0.5">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Previous Session</p>
                          <p className="text-sm text-muted-foreground">Boston, MA • Safari on iOS</p>
                          <p className="text-xs text-muted-foreground">April 15, 2025 (Ended)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </h3>
                    <div className="rounded-md border border-destructive/20 p-4">
                      <h4 className="font-medium mb-2">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
