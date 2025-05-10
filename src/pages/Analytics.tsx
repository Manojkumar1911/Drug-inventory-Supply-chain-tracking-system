
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  Legend, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChartBar, ChartLine, CalendarDays, FileSearch, ArrowUpCircle, ArrowDownCircle, 
  TrendingUp, AlertTriangle, CheckCircle, Search, PieChart as PieChartIcon,
  BarChart as BarChartIcon, Download
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Enhanced dummy data for analytics
const monthlyStockData = [
  { name: 'Jan', value: 400, previousYear: 320 },
  { name: 'Feb', value: 300, previousYear: 290 },
  { name: 'Mar', value: 600, previousYear: 520 },
  { name: 'Apr', value: 800, previousYear: 680 },
  { name: 'May', value: 500, previousYear: 420 },
  { name: 'Jun', value: 650, previousYear: 580 },
  { name: 'Jul', value: 700, previousYear: 600 },
  { name: 'Aug', value: 720, previousYear: 610 },
  { name: 'Sep', value: 680, previousYear: 590 },
  { name: 'Oct', value: 550, previousYear: 540 },
  { name: 'Nov', value: 630, previousYear: 580 },
  { name: 'Dec', value: 750, previousYear: 670 },
];

const usageTrendData = [
  { name: 'Jan', value: 240, forecast: 260 },
  { name: 'Feb', value: 310, forecast: 300 },
  { name: 'Mar', value: 280, forecast: 290 },
  { name: 'Apr', value: 420, forecast: 400 },
  { name: 'May', value: 380, forecast: 390 },
  { name: 'Jun', value: 450, forecast: 460 },
  { name: 'Jul', value: 470, forecast: 480 },
  { name: 'Aug', value: 490, forecast: 500 },
  { name: 'Sep', value: 510, forecast: 520 },
  { name: 'Oct', value: 530, forecast: 550 },
  { name: 'Nov', value: 490, forecast: 510 },
  { name: 'Dec', value: 520, forecast: 540 },
];

const categoryDistributionData = [
  { name: 'Antibiotics', value: 458 },
  { name: 'Cardiovascular', value: 623 },
  { name: 'Diabetes', value: 317 },
  { name: 'Pain Relief', value: 542 },
  { name: 'Respiratory', value: 284 },
  { name: 'Skincare', value: 386 },
  { name: 'Supplements', value: 429 },
];

const locationComparisonData = [
  { name: 'Main Store', antibiotics: 120, cardiovascular: 180, diabetes: 90, painRelief: 150 },
  { name: 'Branch 1', antibiotics: 80, cardiovascular: 140, diabetes: 70, painRelief: 110 },
  { name: 'Branch 2', antibiotics: 110, cardiovascular: 160, diabetes: 60, painRelief: 130 },
  { name: 'Branch 3', antibiotics: 90, cardiovascular: 120, diabetes: 80, painRelief: 100 },
];

const expiryRiskData = [
  { name: '0-30 days', value: 42, risk: 'High' },
  { name: '31-60 days', value: 78, risk: 'Medium' },
  { name: '61-90 days', value: 156, risk: 'Low' },
  { name: '91-180 days', value: 324, risk: 'Very Low' },
  { name: '181+ days', value: 1285, risk: 'None' },
];

const salesVsStockData = [
  { name: 'Antibiotics', sales: 85, stock: 120 },
  { name: 'Cardiovascular', sales: 70, stock: 180 },
  { name: 'Diabetes', sales: 65, stock: 90 },
  { name: 'Pain Relief', sales: 90, stock: 150 },
  { name: 'Respiratory', sales: 55, stock: 100 },
  { name: 'Skincare', sales: 60, stock: 130 },
  { name: 'Supplements', sales: 75, stock: 140 },
];

// Seasonal demand data
const seasonalDemandData = [
  { month: 'Jan', coldMedicine: 350, allergyMedicine: 120, sunscreen: 80, vitaminD: 250 },
  { month: 'Feb', coldMedicine: 320, allergyMedicine: 140, sunscreen: 90, vitaminD: 230 },
  { month: 'Mar', coldMedicine: 280, allergyMedicine: 220, sunscreen: 130, vitaminD: 210 },
  { month: 'Apr', coldMedicine: 220, allergyMedicine: 340, sunscreen: 160, vitaminD: 180 },
  { month: 'May', coldMedicine: 170, allergyMedicine: 380, sunscreen: 220, vitaminD: 150 },
  { month: 'Jun', coldMedicine: 120, allergyMedicine: 350, sunscreen: 340, vitaminD: 120 },
  { month: 'Jul', coldMedicine: 90, allergyMedicine: 320, sunscreen: 380, vitaminD: 110 },
  { month: 'Aug', coldMedicine: 110, allergyMedicine: 290, sunscreen: 350, vitaminD: 130 },
  { month: 'Sep', coldMedicine: 150, allergyMedicine: 250, sunscreen: 270, vitaminD: 160 },
  { month: 'Oct', coldMedicine: 220, allergyMedicine: 190, sunscreen: 160, vitaminD: 190 },
  { month: 'Nov', coldMedicine: 280, allergyMedicine: 150, sunscreen: 100, vitaminD: 230 },
  { month: 'Dec', coldMedicine: 340, allergyMedicine: 130, sunscreen: 70, vitaminD: 260 },
];

// Performance comparison for different products
const productPerformanceData = [
  { x: 75, y: 65, z: 350, name: 'Amoxicillin' },
  { x: 90, y: 85, z: 480, name: 'Lisinopril' },
  { x: 60, y: 40, z: 250, name: 'Metformin' },
  { x: 95, y: 75, z: 520, name: 'Ibuprofen' },
  { x: 70, y: 90, z: 420, name: 'Ventolin' },
  { x: 65, y: 55, z: 380, name: 'Synthroid' },
  { x: 85, y: 80, z: 410, name: 'Lipitor' },
  { x: 78, y: 50, z: 300, name: 'Nexium' },
];

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [showForecasts, setShowForecasts] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("all");
  
  const handleExport = () => {
    toast.success("Analytics report exported successfully!");
  };
  
  const handlePrint = () => {
    window.print();
    toast.success("Sending to printer...");
  };
  
  const handleShare = () => {
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-800 bg-clip-text text-transparent">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive inventory performance metrics and insights
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="main">Main Store</SelectItem>
              <SelectItem value="branch1">Branch 1</SelectItem>
              <SelectItem value="branch2">Branch 2</SelectItem>
              <SelectItem value="branch3">Branch 3</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="showForecasts" 
              checked={showForecasts}
              onChange={() => setShowForecasts(!showForecasts)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="showForecasts">Show Forecasts</Label>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <FileSearch className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ArrowUpCircle className="h-5 w-5 mr-2 text-green-500" />
              Low Stock Items
            </CardTitle>
            <CardDescription>Products below threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">32</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <p className="text-sm text-green-500">+5 from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Expiring Soon
            </CardTitle>
            <CardDescription>Products expiring in 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">156</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-amber-500" />
              <p className="text-sm text-amber-500">+18 from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-indigo-500" />
              Inventory Value
            </CardTitle>
            <CardDescription>Current inventory value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">$142.8k</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <p className="text-sm text-green-500">+15% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Search className="h-5 w-5 mr-2 text-purple-500" />
              Stock Turnover
            </CardTitle>
            <CardDescription>Inventory turnover rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">4.2x</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <p className="text-sm text-green-500">+0.3x from previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Inventory Analytics
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Trends & Forecasts
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Category Analysis
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Seasonal Patterns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="h-5 w-5 mr-2" />
                  Stock Levels
                </CardTitle>
                <CardDescription>Monthly inventory trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} units`, 
                        name === 'value' ? 'Current Year' : 'Previous Year'
                      ]} 
                    />
                    <Legend />
                    <Bar dataKey="value" name="Current Year" fill="#8884d8" />
                    <Bar dataKey="previousYear" name="Previous Year" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartLine className="h-5 w-5 mr-2" />
                  Usage Trends
                </CardTitle>
                <CardDescription>Product consumption over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Actual" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    {showForecasts && (
                      <Line 
                        type="monotone" 
                        dataKey="forecast" 
                        name="Forecast" 
                        stroke="#f5a623" 
                        strokeDasharray="5 5" 
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Product Categories
                </CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Expiry Risk Analysis
                </CardTitle>
                <CardDescription>Products by expiration timeline</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expiryRiskData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Products">
                      {expiryRiskData.map((entry, index) => {
                        let color;
                        switch(entry.risk) {
                          case 'High': color = '#ef4444'; break;
                          case 'Medium': color = '#f59e0b'; break;
                          case 'Low': color = '#10b981'; break;
                          case 'Very Low': color = '#3b82f6'; break;
                          default: color = '#6366f1';
                        }
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Sales vs. Stock Comparison</CardTitle>
                <CardDescription>Analyzing product movement vs. inventory</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesVsStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                    <Bar dataKey="stock" name="Stock" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Product Performance Matrix</CardTitle>
                <CardDescription>Sales velocity vs. profitability vs. stock level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Sales Velocity" 
                      unit="%" 
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Profitability" 
                      unit="%" 
                    />
                    <ZAxis 
                      type="number" 
                      dataKey="z" 
                      range={[60, 400]} 
                      name="Stock Level" 
                      unit=" units" 
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter 
                      name="Products" 
                      data={productPerformanceData} 
                      fill="#8884d8"
                      shape="circle"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
            <CardHeader>
              <CardTitle>Inventory Value Trend</CardTitle>
              <CardDescription>Historical and projected inventory value</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyStockData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Current Year" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="previousYear" 
                    name="Previous Year" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorPrev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Inventory by product category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Location Comparison</CardTitle>
                <CardDescription>Category distribution by location</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={locationComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="antibiotics" name="Antibiotics" fill="#8884d8" />
                    <Bar dataKey="cardiovascular" name="Cardiovascular" fill="#82ca9d" />
                    <Bar dataKey="diabetes" name="Diabetes" fill="#ffc658" />
                    <Bar dataKey="painRelief" name="Pain Relief" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
            <CardHeader>
              <CardTitle>Category Growth Analysis</CardTitle>
              <CardDescription>Year-over-year growth by category</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryDistributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Current Stock" fill="#8884d8">
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
            <CardHeader>
              <CardTitle>Seasonal Demand Patterns</CardTitle>
              <CardDescription>Product demand by season</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="coldMedicine" 
                    name="Cold & Flu" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="allergyMedicine" 
                    name="Allergy" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sunscreen" 
                    name="Sunscreen" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vitaminD" 
                    name="Vitamin D" 
                    stroke="#ff8042" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Seasonal Product Planning</CardTitle>
                <CardDescription>Recommended stock adjustments based on seasonal trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="space-y-5">
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Trending Up (Stock Up)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Allergy Medications</span>
                        <span className="font-medium text-green-500">+25% for Spring</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Sunscreen Products</span>
                        <span className="font-medium text-green-500">+40% for Summer</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Cold & Flu Medicine</span>
                        <span className="font-medium text-green-500">+30% for Winter</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                    <h4 className="font-medium mb-2 flex items-center">
                      <ArrowDownCircle className="h-4 w-4 mr-2 text-amber-500" />
                      Trending Down (Reduce Stock)
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Cold & Flu Medicine</span>
                        <span className="font-medium text-amber-500">-20% for Summer</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Sunscreen Products</span>
                        <span className="font-medium text-amber-500">-30% for Winter</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Vitamin D Supplements</span>
                        <span className="font-medium text-amber-500">-15% for Summer</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/10">
              <CardHeader>
                <CardTitle>Seasonal Profit Analysis</CardTitle>
                <CardDescription>Profit margins by season</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={seasonalDemandData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAllergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="coldMedicine" 
                      name="Cold & Flu" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorCold)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="allergyMedicine" 
                      name="Allergy" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorAllergy)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
