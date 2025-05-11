
import React, { useState, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Save, Check, Upload, X, User, Lock, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Safe access to user metadata with fallback values
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    role: 'Staff',
    location: 'Main Facility'
  };

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    location: userData.location,
    theme: "system",
    notifications: true
  });
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved."
      });
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Password changed successfully", {
        description: "Your new password has been set."
      });
      // Reset form fields
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    toast.success("Avatar selected", {
      description: "Click 'Save Changes' to update your profile."
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Account Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-card to-muted/50 dark:from-card dark:to-card/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <User size={20} className="text-primary" /> 
                Profile Information
              </CardTitle>
              <CardDescription>Update your account profile information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      <AvatarImage src={avatarSrc || undefined} alt="Avatar" />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-primary/80 to-purple-500/80 text-white">
                        {formData.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">{userData.role}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name} 
                      onChange={handleInputChange}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      disabled 
                      className="bg-background/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      value={userData.role} 
                      disabled 
                      className="bg-background/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={formData.location}
                      onValueChange={(value) => handleSelectChange("location", value)}
                    >
                      <SelectTrigger id="location" className="bg-background/50">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Facility">Main Facility</SelectItem>
                        <SelectItem value="Downtown Branch">Downtown Branch</SelectItem>
                        <SelectItem value="Central Warehouse">Central Warehouse</SelectItem>
                        <SelectItem value="South Bay Distribution">South Bay Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button 
                onClick={handleUpdateProfile} 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-card to-muted/50 dark:from-card dark:to-card/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Lock size={20} className="text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" required className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" required className="bg-background/50" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                onClick={handleChangePassword} 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-card to-muted/50 dark:from-card dark:to-card/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Settings size={20} className="text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Manage your app preferences</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select 
                    value={formData.theme}
                    onValueChange={(value) => handleSelectChange("theme", value)}
                  >
                    <SelectTrigger id="theme" className="bg-background/50">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts and notifications</p>
                  </div>
                  <label 
                    htmlFor="notifications" 
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    <input 
                      type="checkbox" 
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Check className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
