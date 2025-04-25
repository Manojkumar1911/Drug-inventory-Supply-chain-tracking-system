
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  // General Settings
  const [companyName, setCompanyName] = useState("PharmaLink LLC");
  const [timezone, setTimezone] = useState("America/New_York");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [language, setLanguage] = useState("en-US");
  
  // Notifications Settings
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  
  // Inventory Settings
  const [lowStockThreshold, setLowStockThreshold] = useState(20);
  const [expiryWarningDays, setExpiryWarningDays] = useState(90);
  const [autoReorder, setAutoReorder] = useState(false);
  
  // Save settings
  const saveGeneralSettings = () => {
    toast.success("General settings saved successfully");
  };
  
  const saveNotificationSettings = () => {
    toast.success("Notification settings saved successfully");
  };
  
  const saveInventorySettings = () => {
    toast.success("Inventory settings saved successfully");
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and configurations
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish</SelectItem>
                    <SelectItem value="fr-FR">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveGeneralSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Methods</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-alerts" 
                    checked={emailAlerts} 
                    onCheckedChange={setEmailAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via text message
                    </p>
                  </div>
                  <Switch 
                    id="sms-alerts" 
                    checked={smsAlerts} 
                    onCheckedChange={setSmsAlerts} 
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-6">Alert Categories</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      When inventory falls below threshold
                    </p>
                  </div>
                  <Switch 
                    id="low-stock-alerts" 
                    checked={lowStockAlerts} 
                    onCheckedChange={setLowStockAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="expiry-alerts">Expiry Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      When products are approaching expiration
                    </p>
                  </div>
                  <Switch 
                    id="expiry-alerts" 
                    checked={expiryAlerts} 
                    onCheckedChange={setExpiryAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-notifications">System Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      General system updates and announcements
                    </p>
                  </div>
                  <Switch 
                    id="system-notifications" 
                    checked={systemNotifications} 
                    onCheckedChange={setSystemNotifications} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>
                Configure inventory management thresholds and behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="low-stock-threshold">Low Stock Threshold (%)</Label>
                    <span className="text-sm">{lowStockThreshold}%</span>
                  </div>
                  <Slider
                    id="low-stock-threshold"
                    value={[lowStockThreshold]}
                    min={5}
                    max={50}
                    step={5}
                    onValueChange={(value) => setLowStockThreshold(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Alert when stock falls below this percentage of ideal level
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="expiry-warning">Expiry Warning Days</Label>
                    <span className="text-sm">{expiryWarningDays} days</span>
                  </div>
                  <Slider
                    id="expiry-warning"
                    value={[expiryWarningDays]}
                    min={30}
                    max={180}
                    step={15}
                    onValueChange={(value) => setExpiryWarningDays(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Alert when products are within this many days of expiry date
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reorder">Auto Reorder</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate purchase orders when stock is low
                    </p>
                  </div>
                  <Switch 
                    id="auto-reorder" 
                    checked={autoReorder} 
                    onCheckedChange={setAutoReorder} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveInventorySettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
