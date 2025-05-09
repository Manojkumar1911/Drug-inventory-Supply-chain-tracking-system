
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, BarChart, AlertCircle, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart as Chart } from '@/components/ui/chart';
import axios from 'axios';
import { toast } from 'sonner';

const GEMINI_API_KEY = "AIzaSyBEH2mYFm2r8NTsfbPGea4vXY3QMF5xrJY";

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

const SmartReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("inventory");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [customQuery, setCustomQuery] = useState<string>("");
  
  const generateReport = async (reportType: string = activeTab) => {
    setIsLoading(true);
    try {
      // Simulated inventory data that would normally come from your database
      const inventoryData = [
        { name: "Amoxicillin 500mg", stock: 245, reorderLevel: 50, category: "Antibiotics", expiryDate: "2025-08-15" },
        { name: "Lisinopril 10mg", stock: 32, reorderLevel: 40, category: "Blood Pressure", expiryDate: "2025-11-20" },
        { name: "Metformin 1000mg", stock: 178, reorderLevel: 60, category: "Diabetes", expiryDate: "2025-07-30" },
        { name: "Atorvastatin 20mg", stock: 58, reorderLevel: 45, category: "Cholesterol", expiryDate: "2026-01-10" },
        { name: "Cetirizine 10mg", stock: 180, reorderLevel: 30, category: "Allergy", expiryDate: "2025-07-25" },
        { name: "Omeprazole 20mg", stock: 26, reorderLevel: 35, category: "Gastrointestinal", expiryDate: "2025-09-05" }
      ];

      // Format the data for Gemini API
      const promptContent = customQuery 
        ? `Analyze this pharmacy inventory data and answer the following question: "${customQuery}"\n\n${JSON.stringify(inventoryData)}`
        : `Analyze this pharmacy inventory data and provide insights for the ${reportType} report type:\n\n${JSON.stringify(inventoryData)}`;
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a pharmacy inventory analyst AI. ${promptContent}
                  
                  Format your response as a JSON object with the following structure:
                  {
                    "title": "Brief title for the report",
                    "description": "Brief summary of the key findings",
                    "insights": ["Insight 1", "Insight 2", "Insight 3"],
                    "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
                    "chart": {
                      "labels": ["Label1", "Label2", "Label3"],
                      "datasets": [
                        {
                          "label": "Dataset Label",
                          "data": [value1, value2, value3],
                          "backgroundColor": "rgba(59, 130, 246, 0.5)"
                        }
                      ]
                    }
                  }
                  
                  Ensure the chart data makes sense for visualization and provides meaningful insights.`
                }
              ]
            }
          ]
        }
      );
      
      if (response?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = response.data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response (it might be surrounded by markdown code blocks)
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || [null, text];
        
        let jsonData: ReportData;
        try {
          jsonData = JSON.parse(jsonMatch[1] || text);
          setReportData(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          toast.error("Error generating report: Invalid response format");
        }
      } else {
        toast.error("Error generating report: No valid response from API");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(`Error generating report: ${error.message || "Unknown error"}`);
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
                <BarChart className="h-4 w-4" />
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
                    <Chart
                      type="bar"
                      data={{
                        labels: reportData.chart.labels,
                        datasets: reportData.chart.datasets
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false
                      }}
                    />
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
