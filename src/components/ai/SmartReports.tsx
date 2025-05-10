
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { toast } from "sonner";
import { Download, Sparkles, Info, ArrowRight, TrendingUp, BarChart3, PieChart as PieChartIcon, Save } from "lucide-react";
import { supabaseClient } from "@/integrations/supabase/client";
import SmartReportForecast from './SmartReportForecast';

// Sample data for the reports
const data = [
  { name: 'Antibiotics', value: 458 },
  { name: 'Cardiovascular', value: 623 },
  { name: 'Diabetes', value: 317 },
  { name: 'Pain Relief', value: 542 },
  { name: 'Respiratory', value: 284 },
  { name: 'Skincare', value: 386 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const lowStockData = [
  { name: 'Amoxicillin', quantity: 25, reorder: 50 },
  { name: 'Lisinopril', quantity: 12, reorder: 40 },
  { name: 'Metformin', quantity: 18, reorder: 30 },
  { name: 'Atorvastatin', quantity: 5, reorder: 25 },
  { name: 'Omeprazole', quantity: 8, reorder: 20 },
];

const expiryData = [
  { name: '0-30 days', value: 42 },
  { name: '31-60 days', value: 78 },
  { name: '61-90 days', value: 156 },
];

const SmartReports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("forecast");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportData, setReportData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<string>("week");

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabaseClient.functions.invoke('generate-smart-report', {
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
          "Sample insight 1 for demonstration purposes.",
          "Sample insight 2 for demonstration purposes.",
          "Sample insight 3 for demonstration purposes."
        ],
        summary: "This is a sample report summary for demonstration purposes."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    toast.success("Report downloaded successfully!");
  };

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
              <h2 className="text-2xl font-bold tracking-tight">Inventory Summary Report</h2>
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
              
              <Button onClick={generateReport} disabled={isGenerating}>
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
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Distribution by Category</CardTitle>
                <CardDescription>Breakdown of stock levels across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData?.data || data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Items" fill="#8884d8">
                      {(reportData?.data || data).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
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
                      <li key={idx} className="flex items-start gap-2 text-sm">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Distribution</CardTitle>
                <CardDescription>Proportion of inventory by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Trend</CardTitle>
                <CardDescription>Stock level changes over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: 'Jan', value: 2400 },
                      { name: 'Feb', value: 1398 },
                      { name: 'Mar', value: 9800 },
                      { name: 'Apr', value: 3908 },
                      { name: 'May', value: 4800 },
                      { name: 'Jun', value: 3800 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" name="Total Items" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Low Stock Tab */}
        <TabsContent value="low_stock" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Low Stock Analysis</h2>
              <p className="text-muted-foreground">
                Items below their recommended reorder levels
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Refresh Data"}
              </Button>
              <Button variant="default" onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
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
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" name="Current Stock" fill="#8884d8" />
                    <Bar dataKey="reorder" name="Reorder Level" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Replenishment Recommendations</CardTitle>
                <CardDescription>AI-generated action items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg">
                    <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
                      {reportData?.summary || "5 items are below reorder threshold. Immediate action recommended for 2 critical items."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {(reportData?.data || lowStockData).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${item.quantity < item.reorder * 0.5 ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                            <span>
                              {item.quantity} of {item.reorder} ({Math.round(item.quantity / item.reorder * 100)}%)
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <span>Reorder</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
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
              <h2 className="text-2xl font-bold tracking-tight">Expiry Analysis</h2>
              <p className="text-muted-foreground">
                Products approaching expiration dates
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Refresh Data"}
              </Button>
              <Button variant="default" onClick={downloadReport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Expiry Timeline Distribution</CardTitle>
                <CardDescription>Products by days until expiration</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData?.data || expiryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {(reportData?.data || expiryData).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={
                          index === 0 ? '#ef4444' : // red for soon expiry
                          index === 1 ? '#f59e0b' : // amber for medium
                          '#10b981' // green for later
                        } />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expiry Insights</CardTitle>
                <CardDescription>AI-generated recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg">
                    <p className="text-sm text-red-900 dark:text-red-300 font-medium">
                      {reportData?.summary || "42 items will expire in the next 30 days. Consider promotions or transfers to reduce waste."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4 text-blue-500" /> Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {(reportData?.insights || [
                        "Run a promotion for items expiring in 30 days",
                        "Transfer near-expiry items to high-turnover locations",
                        "Review ordering patterns for frequently expiring items"
                      ]).map((insight: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-1.5 flex-shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          </div>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
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
