
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LightbulbIcon, RefreshCw, Download, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const SmartReports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("inventory_summary");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const reportOptions = [
    { value: "inventory_summary", label: "Inventory Summary" },
    { value: "low_stock", label: "Low Stock Analysis" },
    { value: "expiry", label: "Expiry Analysis" },
    { value: "transfers", label: "Transfer Patterns" }
  ];
  
  const generateReport = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You need to be logged in to generate reports");
        return;
      }
      
      const response = await supabase.functions.invoke("generate-smart-report", {
        body: {
          reportType,
          timeframe: "month"
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate report");
      }
      
      if (response.data.success) {
        toast.success("AI Report generated successfully");
        setData(response.data.data);
        setInsights(response.data.insights);
        setSummary(response.data.summary);
        setGeneratedAt(response.data.generatedAt);
      } else {
        throw new Error(response.data.error || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(`Failed to generate report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const exportReport = () => {
    if (!data.length) {
      toast.error("No data to export");
      return;
    }
    
    try {
      // Convert data to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      const csv = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `smart-report-${reportType}-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const renderChart = () => {
    if (!data.length) return null;
    
    if (reportType === "inventory_summary") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (reportType === "low_stock") {
      // Group by category
      const categories: {[key: string]: number} = {};
      data.forEach(item => {
        if (!categories[item.category]) categories[item.category] = 0;
        categories[item.category]++;
      });
      
      const pieData = Object.keys(categories).map(key => ({
        name: key,
        value: categories[key]
      }));
      
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    // Simple table for other report types
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              {Object.keys(data[0]).filter(key => 
                !['id', 'created_at', 'updated_at'].includes(key)
              ).map(key => (
                <th key={key} className="p-2 text-left">{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                {Object.entries(row).filter(([key]) => 
                  !['id', 'created_at', 'updated_at'].includes(key)
                ).map(([key, value]) => (
                  <td key={key} className="p-2">
                    {typeof value === 'string' && key.includes('date') ? 
                      new Date(value).toLocaleDateString() : 
                      String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-t-4 border-t-blue-500 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-500" />
                AI Smart Reports
              </CardTitle>
              <CardDescription>
                Gain insights from your inventory data using AI analysis
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {generatedAt && (
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Clock className="h-3 w-3" />
                  {new Date(generatedAt).toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-3">
              <div className="mb-6 flex gap-4">
                <Select 
                  value={reportType} 
                  onValueChange={setReportType}
                >
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={generateReport}
                  disabled={loading}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={exportReport}
                  disabled={!data.length || loading}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              
              {summary && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-950/40 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <LightbulbIcon className="h-4 w-4 text-blue-500" />
                    AI Summary
                  </h3>
                  <p className="text-muted-foreground">{summary}</p>
                </div>
              )}
              
              <div className="border rounded-md p-4 min-h-[300px] bg-card">
                {data.length > 0 ? renderChart() : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a report type and click Generate</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:border-l md:pl-4">
              <h3 className="font-medium mb-4">AI Insights</h3>
              {insights.length > 0 ? (
                <ul className="space-y-3">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 p-1 rounded-full mt-0.5">
                        <LightbulbIcon className="h-3 w-3" />
                      </span>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate a report to see AI insights
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
          Reports are generated based on your current inventory data. The AI analyzes patterns and provides actionable insights.
        </CardFooter>
      </Card>
    </div>
  );
};

export default SmartReports;
