
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, BarChart as BarChartIcon, AlertCircle, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer } from '@/components/ui/chart';
import { toast } from 'sonner';

interface ReportData {
  title: string;
  description: string;
  insights: string[];
  recommendations: string[];
  chart?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
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
    chart: {
      labels: ["Antibiotics", "Blood Pressure", "Diabetes", "Cholesterol", "Allergy", "Gastrointestinal"],
      datasets: [{
        label: "Current Stock Value ($)",
        data: [12500, 6800, 8900, 7200, 4500, 3800],
        backgroundColor: "rgba(59, 130, 246, 0.5)"
      }]
    }
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
    chart: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [{
        label: "Inventory Turnover Rate",
        data: [2.1, 2.3, 2.6, 2.8, 3.0, 3.1],
        backgroundColor: "rgba(99, 102, 241, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Antibiotics", "Blood Pressure", "Diabetes", "Cholesterol", "Psychiatric", "Respiratory"],
      datasets: [{
        label: "Profit Margin (%)",
        data: [35, 38, 42, 31, 40, 29],
        backgroundColor: "rgba(79, 70, 229, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Expiry Risk", "Stockout Risk", "Oversupply Risk", "Quality Risk", "Compliance Risk", "Financial Risk"],
      datasets: [{
        label: "Risk Score (1-10)",
        data: [8, 6, 4, 3, 2, 5],
        backgroundColor: "rgba(239, 68, 68, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Within 30 days", "31-60 days", "61-90 days", "91-180 days", "181-365 days", ">365 days"],
      datasets: [{
        label: "Product Count",
        data: [2, 3, 2, 8, 15, 35],
        backgroundColor: "rgba(245, 158, 11, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Antibiotics", "Blood Pressure", "Diabetes", "Cholesterol", "Psychiatric", "Respiratory"],
      datasets: [{
        label: "Products Below Reorder Level",
        data: [3, 2, 1, 2, 3, 1],
        backgroundColor: "rgba(220, 38, 38, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Storage", "Insurance", "Taxes", "Obsolescence", "Handling", "Other"],
      datasets: [{
        label: "Cost Components (%)",
        data: [35, 12, 8, 25, 15, 5],
        backgroundColor: "rgba(16, 185, 129, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Supplier A", "Supplier B", "Supplier C", "Supplier D", "Supplier E", "Others"],
      datasets: [{
        label: "Reliability Score (1-100)",
        data: [92, 87, 78, 85, 80, 75],
        backgroundColor: "rgba(124, 58, 237, 0.5)"
      }]
    }
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
    chart: {
      labels: ["Category A", "Category B", "Category C", "Category D", "Category E", "Category F"],
      datasets: [{
        label: "Inventory Distribution",
        data: [35, 25, 15, 10, 10, 5],
        backgroundColor: "rgba(59, 130, 246, 0.5)"
      }]
    }
  };
};

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
                    {isLoading ? 'Generating...' : 'Generate Custom Report'}
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
                  {isLoading ? 'Generating...' : `Generate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`}
                </Button>
              </div>
            )}
            
            {reportData ? (
              <div className="space-y-6 mt-4">
                <div className="border-b pb-4">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">{reportData.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{reportData.description}</p>
                </div>
                
                {reportData.chart && (
                  <div className="border p-4 rounded-lg bg-white dark:bg-gray-800 h-[300px]">
                    <div className="w-full h-full">
                      <div className="flex justify-center items-center h-full">
                        <div className="w-full max-w-3xl">
                          <div className="text-center mb-4 text-lg font-medium">
                            Data Visualization
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {reportData.chart.labels.map((label, index) => (
                              <div 
                                key={index} 
                                className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg"
                                style={{
                                  height: `${(reportData.chart?.datasets[0].data[index] || 0) / Math.max(...reportData.chart?.datasets[0].data) * 100}%`,
                                  minHeight: '40px'
                                }}
                              >
                                <div className="flex flex-col justify-between h-full">
                                  <div className="font-medium">{label}</div>
                                  <div className="text-lg font-bold">
                                    {reportData.chart?.datasets[0].data[index]}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Insights</CardTitle>
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
                      <CardTitle className="text-lg">Recommendations</CardTitle>
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
          Note: The Smart Reports feature uses AI to generate insights based on your inventory data.
          For the demo, we're using sample data. In a production environment, this would use your actual inventory data.
        </p>
      </div>
    </div>
  );
};

export default SmartReports;
