
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, BarChart as BarChartIcon, AlertCircle, LayoutDashboard, FileText, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportData {
  title: string;
  description: string;
  insights: string[];
  recommendations: string[];
  chartData?: any[];
  chartType?: 'bar' | 'pie' | 'line';
}

// Sample inventory data for demonstration
const sampleInventoryData = [
  { name: "Amoxicillin 500mg", stock: 245, reorderLevel: 50, category: "Antibiotics", expiryDate: "2025-08-15" },
  { name: "Lisinopril 10mg", stock: 32, reorderLevel: 40, category: "Blood Pressure", expiryDate: "2025-11-20" },
  { name: "Metformin 1000mg", stock: 178, reorderLevel: 60, category: "Diabetes", expiryDate: "2025-07-30" },
  { name: "Atorvastatin 20mg", stock: 58, reorderLevel: 45, category: "Cholesterol", expiryDate: "2026-01-10" },
  { name: "Cetirizine 10mg", stock: 180, reorderLevel: 30, category: "Allergy", expiryDate: "2025-07-25" },
  { name: "Omeprazole 20mg", stock: 26, reorderLevel: 35, category: "Gastrointestinal", expiryDate: "2025-09-05" },
  { name: "Alprazolam 0.5mg", stock: 120, reorderLevel: 40, category: "Psychiatric", expiryDate: "2025-10-15" },
  { name: "Hydrochlorothiazide 25mg", stock: 85, reorderLevel: 50, category: "Diuretic", expiryDate: "2025-12-20" },
  { name: "Levothyroxine 50mcg", stock: 15, reorderLevel: 30, category: "Thyroid", expiryDate: "2025-06-10" },
  { name: "Montelukast 10mg", stock: 42, reorderLevel: 25, category: "Respiratory", expiryDate: "2025-08-30" }
];

// Pre-generated reports for each category
const preGeneratedReports: Record<string, ReportData> = {
  inventory: {
    title: "Inventory Status Overview",
    description: "Analysis of current inventory levels and distribution across categories",
    insights: [
      "30% of products are below optimal stock levels based on historical usage patterns",
      "Antibiotics category has the highest inventory value at approximately $12,500",
      "3 products will expire within the next 60 days, requiring prompt attention"
    ],
    recommendations: [
      "Increase reorder quantities for Lisinopril and Omeprazole to prevent stockouts",
      "Consider redistributing excess Amoxicillin stock to other locations with higher demand",
      "Implement a seasonal adjustment for antihistamine stock levels in the coming allergy season"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Antibiotics", value: 12500},
      {name: "Blood Pressure", value: 6800},
      {name: "Diabetes", value: 8900},
      {name: "Cholesterol", value: 7200},
      {name: "Allergy", value: 4500},
      {name: "Gastrointestinal", value: 3800}
    ]
  },
  trends: {
    title: "Quarterly Inventory Trends Analysis",
    description: "Evaluation of inventory movements and consumption patterns over the past 3 months",
    insights: [
      "Overall inventory turnover rate has increased by 12% compared to the previous quarter",
      "Blood pressure medications show the highest growth in consumption (18% increase)",
      "Antibiotics usage has decreased by 7%, possibly due to seasonal changes"
    ],
    recommendations: [
      "Adjust procurement schedule for blood pressure medications to account for increased demand",
      "Review antibiotic ordering patterns to prevent potential overstocking in the coming months",
      "Implement automatic reordering for the top 5 most frequently dispensed medications"
    ],
    chartType: 'line',
    chartData: [
      {name: "January", value: 2.1},
      {name: "February", value: 2.3},
      {name: "March", value: 2.6},
      {name: "April", value: 2.8},
      {name: "May", value: 3.0},
      {name: "June", value: 3.1}
    ]
  },
  categories: {
    title: "Category Performance Report",
    description: "Analysis of inventory metrics by therapeutic category",
    insights: [
      "Diabetes medications have the highest profit margin at 42% on average",
      "Respiratory medications have the lowest turnover rate at 1.8 times per quarter",
      "Psychiatric medications show inconsistent ordering patterns, causing occasional stockouts"
    ],
    recommendations: [
      "Optimize storage space allocation based on category performance and turnover rates",
      "Implement category-specific reorder levels for respiratory medications to prevent overstock",
      "Develop a specialized procurement strategy for psychiatric medications to reduce stockouts"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Antibiotics", value: 35},
      {name: "Blood Pressure", value: 38},
      {name: "Diabetes", value: 42},
      {name: "Cholesterol", value: 31},
      {name: "Psychiatric", value: 40},
      {name: "Respiratory", value: 29}
    ]
  },
  alerts: {
    title: "Inventory Risk Analysis",
    description: "Assessment of potential inventory risks and mitigation strategies",
    insights: [
      "4 products are at high risk of expiry within the next 90 days, representing $2,800 in inventory value",
      "2 products have experienced frequent stockouts (>3 times) in the past quarter",
      "Non-optimized reorder levels are causing an estimated 12% in excess carrying costs"
    ],
    recommendations: [
      "Implement a targeted promotion for the 4 products approaching expiry to reduce waste",
      "Adjust the reorder points for frequently stocked-out items by adding a 20% buffer",
      "Review and update carrying cost calculations to optimize inventory investment"
    ],
    chartType: 'pie',
    chartData: [
      {name: "Expiry Risk", value: 8},
      {name: "Stockout Risk", value: 6},
      {name: "Oversupply Risk", value: 4},
      {name: "Quality Risk", value: 3},
      {name: "Compliance Risk", value: 2},
      {name: "Financial Risk", value: 5}
    ]
  }
};

// Custom query responses
const customQueryResponses: Record<string, ReportData> = {
  "expiring products": {
    title: "Expiring Products Analysis",
    description: "Detailed assessment of products approaching their expiration dates",
    insights: [
      "7 products will expire within the next 3 months, with a total value of $4,200",
      "Antibiotics represent 40% of the products approaching expiry by value",
      "Current disposal costs for expired medications average $320 per month"
    ],
    recommendations: [
      "Implement a 'first to expire, first out' (FEFO) inventory management system",
      "Establish a weekly expired product review process to minimize waste",
      "Coordinate with suppliers for a possible return program for products within 60 days of expiry"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Within 30 days", value: 2},
      {name: "31-60 days", value: 3},
      {name: "61-90 days", value: 2},
      {name: "91-180 days", value: 8},
      {name: "181-365 days", value: 15},
      {name: ">365 days", value: 35}
    ]
  },
  "low stock": {
    title: "Low Stock Products Analysis",
    description: "Evaluation of products currently below their recommended reorder levels",
    insights: [
      "12 products are currently below their reorder levels, with 4 at critical levels",
      "Average time to restock from main suppliers is 3.5 days, with significant variation",
      "Low stock situations have led to approximately 8 stockouts in the past month"
    ],
    recommendations: [
      "Establish emergency supplier relationships for the 4 products at critical levels",
      "Review and update reorder levels based on recent consumption patterns",
      "Implement automated alerts at 20% above reorder levels for high-priority medications"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Antibiotics", value: 3},
      {name: "Blood Pressure", value: 2},
      {name: "Diabetes", value: 1},
      {name: "Cholesterol", value: 2},
      {name: "Psychiatric", value: 3},
      {name: "Respiratory", value: 1}
    ]
  },
  "cost analysis": {
    title: "Inventory Cost Analysis",
    description: "Assessment of inventory carrying costs and optimization opportunities",
    insights: [
      "Total inventory carrying cost is approximately 23% of inventory value annually",
      "Refrigerated medications account for 35% of storage costs but only 12% of inventory",
      "Bulk purchasing discounts averaged 8.5% savings in the last quarter"
    ],
    recommendations: [
      "Renegotiate terms with suppliers of high-value items to improve cash flow",
      "Optimize refrigerated storage allocation to reduce energy costs",
      "Develop a hybrid JIT system for fast-moving items to reduce carrying costs"
    ],
    chartType: 'pie',
    chartData: [
      {name: "Storage", value: 35},
      {name: "Insurance", value: 12},
      {name: "Taxes", value: 8},
      {name: "Obsolescence", value: 25},
      {name: "Handling", value: 15},
      {name: "Other", value: 5}
    ]
  },
  "supplier performance": {
    title: "Supplier Performance Analysis",
    description: "Evaluation of supplier reliability, pricing, and service quality",
    insights: [
      "Top 3 suppliers account for 65% of total inventory purchases",
      "On-time delivery performance ranges from 78% to 94% across major suppliers",
      "Average price increases were 4.2% over the past year, above the industry average of 3.1%"
    ],
    recommendations: [
      "Diversify supplier base for critical medications to reduce dependency risks",
      "Implement a formal supplier performance review process on a quarterly basis",
      "Negotiate price lock guarantees for high-volume items to control cost increases"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Supplier A", value: 92},
      {name: "Supplier B", value: 87},
      {name: "Supplier C", value: 78},
      {name: "Supplier D", value: 85},
      {name: "Supplier E", value: 80},
      {name: "Others", value: 75}
    ]
  }
};

// Function to process custom queries and return relevant pre-generated responses
const processCustomQuery = (query: string): ReportData | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Check for exact matches in our predefined responses
  if (customQueryResponses[normalizedQuery]) {
    return customQueryResponses[normalizedQuery];
  }
  
  // Check for keyword matches
  if (normalizedQuery.includes("expir")) {
    return customQueryResponses["expiring products"];
  } else if (normalizedQuery.includes("low stock") || normalizedQuery.includes("below reorder") || normalizedQuery.includes("stockout")) {
    return customQueryResponses["low stock"];
  } else if (normalizedQuery.includes("cost") || normalizedQuery.includes("expense") || normalizedQuery.includes("saving")) {
    return customQueryResponses["cost analysis"];
  } else if (normalizedQuery.includes("supplier") || normalizedQuery.includes("vendor") || normalizedQuery.includes("delivery")) {
    return customQueryResponses["supplier performance"];
  }
  
  // If no matches found, return a generic analysis
  return {
    title: "Custom Inventory Analysis",
    description: "Analysis based on your specific query",
    insights: [
      "Inventory efficiency could be improved by optimizing reorder points",
      "Category distribution shows some imbalance that may affect service levels",
      "Several products show seasonal demand patterns that should inform purchasing"
    ],
    recommendations: [
      "Review inventory allocation across categories to better match demand patterns",
      "Consider implementing ABC analysis to focus attention on high-value items",
      "Develop standard operating procedures for inventory exceptions and special cases"
    ],
    chartType: 'bar',
    chartData: [
      {name: "Category A", value: 35},
      {name: "Category B", value: 25},
      {name: "Category C", value: 15},
      {name: "Category D", value: 10},
      {name: "Category E", value: 10},
      {name: "Category F", value: 5}
    ]
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SmartReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("inventory");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [customQuery, setCustomQuery] = useState<string>("");
  
  const generateReport = async (reportType: string = activeTab) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      if (reportType === "custom") {
        // Process custom query and get relevant pre-generated response
        const customReport = processCustomQuery(customQuery);
        setReportData(customReport);
      } else {
        // Use pre-generated reports for standard report types
        setReportData(preGeneratedReports[reportType]);
      }
      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setReportData(null); // Clear previous report data
    setCustomQuery(""); // Clear custom query
  };

  const handleCustomReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      generateReport("custom");
    }
  };

  const exportReport = () => {
    if (!reportData) return;
    
    // Create a text version of the report
    const reportText = `
# ${reportData.title}
${reportData.description}

## Key Insights
${reportData.insights.map((insight, i) => `${i+1}. ${insight}`).join('\n')}

## Recommendations
${reportData.recommendations.map((rec, i) => `${i+1}. ${rec}`).join('\n')}

Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    `;
    
    // Create a Blob with the report content
    const blob = new Blob([reportText], { type: 'text/plain' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Report exported successfully");
  };

  const renderChart = () => {
    if (!reportData?.chartData) return null;
    
    if (reportData.chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={reportData.chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {reportData.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value, 'Value']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    // Default to bar chart
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={reportData.chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>AI-Powered Smart Reports</CardTitle>
          </div>
          <CardDescription>
            Generate intelligent analyses and insights based on your inventory data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inventory" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="inventory" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <BarChartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Risk Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Custom</span>
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'custom' ? (
              <div>
                <form onSubmit={handleCustomReportSubmit} className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="customQuery" className="text-sm font-medium">
                      What would you like to know about your inventory?
                    </label>
                    <Input
                      id="customQuery"
                      placeholder="e.g., Which products are likely to expire in the next 3 months?"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !customQuery.trim()} 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : 'Generate Custom Report'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex justify-end mb-6">
                <Button 
                  onClick={() => generateReport()} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : `Generate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`}
                </Button>
              </div>
            )}
            
            {reportData ? (
              <div className="space-y-6 mt-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">{reportData.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{reportData.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportReport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                {reportData.chartData && (
                  <div className="border p-4 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
                    {renderChart()}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {reportData.insights.map((insight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {reportData.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-600/20 text-green-600 flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (!isLoading && (
              <div className="border border-dashed rounded-lg p-8 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-600/50" />
                <h3 className="text-lg font-medium mb-2">No Report Generated Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Click the generate button to create an AI-powered analysis of your inventory data.
                </p>
              </div>
            ))}
            
            {isLoading && (
              <div className="border rounded-lg p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Generating Your Report</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI is analyzing your inventory data and preparing insights...
                </p>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        <p>
          <strong>How to Use Smart Reports:</strong> Select a report type from the tabs above or create a custom query. Reports provide insights into your inventory data, identify trends, and offer recommendations for optimizing your pharmacy operations.
        </p>
      </div>
    </div>
  );
};

export default SmartReports;
