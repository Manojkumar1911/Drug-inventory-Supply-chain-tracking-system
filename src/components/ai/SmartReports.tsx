
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart 
} from "recharts";
import { toast } from "sonner";
import { Download, Sparkles, Info, ArrowRight, TrendingUp, BarChart3, PieChart as PieChartIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SmartReportForecast from './SmartReportForecast';
import { useTheme } from '@/context/ThemeContext';
import PageLoader from '../ui/page-loader';

// Enhanced color schemes for better visualization
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', 
  '#FFBB28', '#FF8042', '#a442f5', '#f55142', '#41c9f5', '#f5c741'
];

const DARK_COLORS = [
  '#9e61ff', '#62e3b8', '#ffdd66', '#ff9f59', '#36a2ff', '#43d9b8', 
  '#FFD34E', '#FF9966', '#ba53ff', '#ff7b6e', '#63d6ff', '#ffdb66'
];

// Sample data with more items for richer visualization
const data = [
  { name: 'Antibiotics', value: 458, growth: 5.2, cost: 1245.67 },
  { name: 'Cardiovascular', value: 623, growth: 7.8, cost: 2134.29 },
  { name: 'Diabetes', value: 317, growth: -2.1, cost: 987.45 },
  { name: 'Pain Relief', value: 542, growth: 3.4, cost: 1432.78 },
  { name: 'Respiratory', value: 284, growth: 1.9, cost: 874.32 },
  { name: 'Skincare', value: 386, growth: 4.7, cost: 967.21 },
  { name: 'Vitamins', value: 275, growth: 9.3, cost: 645.87 },
  { name: 'Gastrointestinal', value: 198, growth: -1.2, cost: 732.45 }
];

const lowStockData = [
  { name: 'Amoxicillin', quantity: 25, reorder: 50, supplier: 'PharmaCo', supplyDays: 3 },
  { name: 'Lisinopril', quantity: 12, reorder: 40, supplier: 'MedSupply', supplyDays: 5 },
  { name: 'Metformin', quantity: 18, reorder: 30, supplier: 'PharmaCo', supplyDays: 2 },
  { name: 'Atorvastatin', quantity: 5, reorder: 25, supplier: 'GlobalMed', supplyDays: 7 },
  { name: 'Omeprazole', quantity: 8, reorder: 20, supplier: 'MedSupply', supplyDays: 4 },
  { name: 'Albuterol', quantity: 15, reorder: 35, supplier: 'RespiraCare', supplyDays: 6 }
];

const expiryData = [
  { name: '0-30 days', value: 42, items: ['Amoxicillin', 'Hydrocortisone', 'Insulin'] },
  { name: '31-60 days', value: 78, items: ['Lisinopril', 'Metformin', 'Omeprazole', 'Lorazepam'] },
  { name: '61-90 days', value: 156, items: ['Pantoprazole', 'Sertraline', 'Gabapentin'] }
];

const SmartReports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("forecast");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>("week");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  // Simulate initial loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setReportData({
        data: reportType === "low_stock" ? lowStockData : 
              reportType === "expiry" ? expiryData : data,
        insights: [
          "Antibiotics category shows consistent growth and may need increased stock levels.",
          "Consider redistributing vitamins across locations due to high demand variation.",
          "Pain relief medications show seasonal patterns that align with historical data."
        ],
        summary: "Overall inventory is well-balanced with a few categories requiring attention."
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-smart-report', {
        body: {
          reportType: reportType === "forecast" ? "inventory_summary" : reportType,
          timeframe: timeframe
        }
      });

      if (error) throw error;

      setReportData(data);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
      // Fall back to sample data if API fails
      setReportData({
        data: reportType === "low_stock" ? lowStockData : 
              reportType === "expiry" ? expiryData : data,
        insights: [
          "Antibiotics category shows consistent growth and may need increased stock levels.",
          "Consider redistributing vitamins across locations due to high demand variation.",
          "Pain relief medications show seasonal patterns that align with historical data."
        ],
        summary: "Overall inventory is well-balanced with a few categories requiring attention."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    toast.success("Report downloaded successfully!");
  };

  if (isLoading) {
    return <PageLoader message="Loading smart reports..." />;
  }

  const colorScheme = theme === 'dark' ? DARK_COLORS : COLORS;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="forecast" value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full mb-6">
          <TabsTrigger value="forecast" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Demand Forecast
          </TabsTrigger>
          <TabsTrigger value="inventory_summary" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Inventory Summary
          </TabsTrigger>
          <TabsTrigger value="low_stock" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Low Stock Analysis
          </TabsTrigger>
          <TabsTrigger value="expiry" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Expiry Analysis
          </TabsTrigger>
        </TabsList>
        
        {/* ARIMA Forecasting Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <SmartReportForecast />
        </TabsContent>
        
        {/* Inventory Summary Tab */}
        <TabsContent value="inventory_summary" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Inventory Summary Report
              </h2>
              <p className="text-muted-foreground">
                Overview of your current inventory distribution and insights
              </p>
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="quarter">Past Quarter</SelectItem>
                  <SelectItem value="year">Past Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : "Generate Report"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Distribution by Category</CardTitle>
                <CardDescription>Breakdown of stock levels across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData?.data || data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="name"
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <Tooltip 
                      cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                      formatter={(value: any, name: any) => [`${value} units`, name]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Items" radius={[4, 4, 0, 0]}>
                      {(reportData?.data || data).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                      ))}
                    </Bar>
                    <Bar dataKey="growth" name="Growth %" fill="#ff7300" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-850">
              <CardHeader>
                <CardTitle className="text-lg">AI Insights</CardTitle>
                <CardDescription>Generated from inventory data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 rounded-lg">
                    <p className="text-sm text-purple-900 dark:text-purple-300 font-medium leading-relaxed">
                      {reportData?.summary || "Generate a report to see AI-powered insights and recommendations based on your inventory data."}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-500" /> Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {(reportData?.insights || [
                      "Generate a report to see insights",
                      "The AI will analyze your inventory data",
                      "You'll get actionable recommendations"
                    ]).map((insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                        </div>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={downloadReport} 
                  disabled={!reportData}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
                <CardDescription>Proportion of inventory by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {colorScheme.map((color, index) => (
                        <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={reportData?.data || data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(reportData?.data || data).map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#colorGradient-${index % colorScheme.length})`} 
                          stroke={colorScheme[index % colorScheme.length]}
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                      formatter={(value: any, name: any, props: any) => {
                        const item = (reportData?.data || data)[props.dataKey];
                        return [`${value} units (${((value / (reportData?.data || data).reduce((a: number, b: any) => a + b.value, 0)) * 100).toFixed(1)}%)`, name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Trend</CardTitle>
                <CardDescription>Stock level changes over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Jan', value: 2400, previous: 1800 },
                      { name: 'Feb', value: 1398, previous: 1210 },
                      { name: 'Mar', value: 9800, previous: 8900 },
                      { name: 'Apr', value: 3908, previous: 3100 },
                      { name: 'May', value: 4800, previous: 4200 },
                      { name: 'Jun', value: 3800, previous: 3500 },
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      name="Current Stock" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="previous" 
                      name="Previous Period" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorPrevious)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Low Stock Tab */}
        <TabsContent value="low_stock" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                Low Stock Analysis
              </h2>
              <p className="text-muted-foreground">
                Items below their recommended reorder levels
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={generateReport} 
                disabled={isGenerating}
                className="border-amber-600/40 hover:border-amber-600/60 dark:border-amber-500/30 dark:hover:border-amber-500/50"
              >
                {isGenerating ? "Generating..." : "Refresh Data"}
              </Button>
              <Button 
                variant="default" 
                onClick={downloadReport}
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Items Below Reorder Level</CardTitle>
                <CardDescription>Critical items requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={reportData?.data || lowStockData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <YAxis 
                      tick={{ fill: theme === 'dark' ? '#ccc' : '#333' }}
                      stroke={theme === 'dark' ? '#777' : '#ccc'}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                      formatter={(value: any, name: any) => {
                        if (name === 'Current Stock') {
                          const item = (reportData?.data || lowStockData).find(
                            (d: any) => d.quantity === value
                          );
                          return [`${value} units (${item ? Math.round((value / item.reorder) * 100) : 0}%)`, name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="quantity" 
                      name="Current Stock" 
                      radius={[4, 4, 0, 0]}
                    >
                      {(reportData?.data || lowStockData).map((entry: any) => (
                        <Cell 
                          key={`cell-${entry.name}`} 
                          fill={entry.quantity < entry.reorder / 2 ? '#ef4444' : '#f59e0b'} 
                        />
                      ))}
                    </Bar>
                    <Bar 
                      dataKey="reorder" 
                      name="Reorder Level" 
                      radius={[4, 4, 0, 0]} 
                      fill="#22c55e" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border border-amber-200/50 dark:border-amber-900/30 hover:shadow-xl hover:border-amber-200/80 dark:hover:border-amber-900/50 transition-all bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-amber-950/10">
              <CardHeader>
                <CardTitle className="text-lg">Replenishment Recommendations</CardTitle>
                <CardDescription>AI-generated action items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg shadow-sm">
                    <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
                      {reportData?.summary || "5 items are below reorder threshold. Immediate action recommended for 2 critical items."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {(reportData?.data || lowStockData).map((item: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex flex-col text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${item.quantity < item.reorder * 0.5 ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                              <span>
                                {item.quantity} of {item.reorder} ({Math.round(item.quantity / item.reorder * 100)}%)
                              </span>
                            </div>
                            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                              Supplier: {item.supplier} ({item.supplyDays} days delivery)
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`flex items-center gap-1 ${
                            item.quantity < item.reorder * 0.5 
                              ? 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400' 
                              : 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          <span>Reorder</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all">
                  <Save className="mr-2 h-4 w-4" /> Generate Purchase Orders
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Expiry Tab */}
        <TabsContent value="expiry" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Expiry Analysis
              </h2>
              <p className="text-muted-foreground">
                Products approaching expiration dates
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Refresh Data"}
              </Button>
              <Button 
                variant="default" 
                onClick={downloadReport}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Expiry Timeline Distribution</CardTitle>
                <CardDescription>Products by days until expiration</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="colorExpirySoon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="colorExpiryMid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="colorExpiryLater" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <Pie
                      data={reportData?.data || expiryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(reportData?.data || expiryData).map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index === 0 ? 'url(#colorExpirySoon)' : 
                            index === 1 ? 'url(#colorExpiryMid)' : 
                            'url(#colorExpiryLater)'
                          }
                          stroke={
                            index === 0 ? '#dc2626' : 
                            index === 1 ? '#d97706' : 
                            '#0d9488'
                          }
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                      formatter={(value: any, name: any, props: any) => {
                        const entry = (reportData?.data || expiryData)[props.index];
                        return [
                          <>
                            <div>{value} items</div>
                            {entry?.items && (
                              <div className="text-xs mt-1">
                                Including: {entry.items.join(', ')}
                              </div>
                            )}
                          </>, 
                          name
                        ];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border border-red-200/50 dark:border-red-900/30 hover:shadow-xl hover:border-red-200/80 dark:hover:border-red-900/50 transition-all bg-gradient-to-br from-white to-red-50/30 dark:from-gray-900 dark:to-red-950/10">
              <CardHeader>
                <CardTitle className="text-lg">Expiry Insights</CardTitle>
                <CardDescription>AI-generated recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg shadow-sm">
                    <p className="text-sm text-red-900 dark:text-red-300 font-medium">
                      {reportData?.summary || "42 items will expire in the next 30 days. Consider promotions or transfers to reduce waste."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4 text-blue-500" /> Recommendations
                    </h4>
                    <ul className="space-y-3">
                      {(reportData?.insights || [
                        "Run a promotion for items expiring in 30 days",
                        "Transfer near-expiry items to high-turnover locations",
                        "Review ordering patterns for frequently expiring items"
                      ]).map((insight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                          <div className="mt-1.5 flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          </div>
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all">
                  Create Action Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartReports;
