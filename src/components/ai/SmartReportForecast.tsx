
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from "sonner";
import { Sparkles, TrendingUp, AlertTriangle, BarChart4, RefreshCw, Info } from "lucide-react";
import { generateForecastReport } from '@/utils/arimaModel';
import { Skeleton } from "@/components/ui/skeleton";

// Demo data - in a real app this would come from API calls
const demoItems = [
  { id: 1, name: "Amoxicillin", sku: "AMOX-500" },
  { id: 2, name: "Atorvastatin", sku: "ATOR-20" },
  { id: 3, name: "Lisinopril", sku: "LISP-10" },
  { id: 4, name: "Metformin", sku: "METF-500" },
  { id: 5, name: "Ibuprofen", sku: "IBPF-400" }
];

// Sample historical data for each item
const demoHistoricalData: Record<number, number[]> = {
  1: [120, 115, 125, 118, 130, 125, 135, 140, 138, 145, 150, 148, 155, 153, 160, 165, 162, 170, 175, 172, 180],
  2: [80, 82, 79, 85, 83, 88, 90, 87, 92, 95, 94, 98, 100, 103, 99, 105, 108, 106, 110, 112, 109],
  3: [200, 198, 205, 195, 210, 208, 215, 212, 220, 218, 225, 222, 230, 228, 235, 232, 240, 238, 245, 242, 250],
  4: [150, 155, 145, 160, 155, 165, 160, 170, 165, 175, 170, 180, 175, 185, 180, 190, 185, 195, 190, 200, 195],
  5: [95, 100, 98, 105, 102, 110, 108, 115, 112, 120, 117, 125, 122, 130, 127, 135, 132, 140, 137, 145, 142]
};

// Reorder points
const demoReorderPoints: Record<number, number> = {
  1: 100,
  2: 70,
  3: 180,
  4: 130,
  5: 85
};

interface ForecastProps {
  className?: string;
}

const SmartReportForecast: React.FC<ForecastProps> = ({ className }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [forecastDays, setForecastDays] = useState<number>(7);
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<string>("line");

  useEffect(() => {
    // Auto-select first item on component mount
    if (demoItems.length > 0) {
      setSelectedItem(demoItems[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      generateForecast(selectedItem, forecastDays);
    }
  }, [selectedItem, forecastDays]);

  const generateForecast = async (itemId: number, days: number) => {
    setLoading(true);
    
    try {
      // In a real app, this data would come from an API call
      const historicalData = demoHistoricalData[itemId] || [];
      const item = demoItems.find(i => i.id === itemId) || { name: "Unknown Item", sku: "UNKNOWN" };
      const reorderPoint = demoReorderPoints[itemId];
      
      // Small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate forecast using ARIMA model
      const forecast = generateForecastReport(item.name, historicalData, days, reorderPoint);
      
      setForecastData({
        ...forecast,
        item,
        reorderPoint
      });
      
    } catch (error) {
      console.error("Error generating forecast:", error);
      toast.error("Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedItem) {
      toast.info("Refreshing forecast data...");
      generateForecast(selectedItem, forecastDays);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Inventory Forecasting
          </h2>
          <p className="text-muted-foreground">
            Predict future inventory levels using advanced ARIMA modeling
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={selectedItem?.toString() || ""} 
            onValueChange={(value) => setSelectedItem(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {demoItems.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={forecastDays.toString()} 
            onValueChange={(value) => setForecastDays(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Forecast period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Days</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {selectedItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Forecast Trend</CardTitle>
                <Tabs defaultValue="line" value={chartType} onValueChange={setChartType} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="line"><BarChart4 className="h-4 w-4" /></TabsTrigger>
                    <TabsTrigger value="area"><TrendingUp className="h-4 w-4" /></TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {forecastData && (
                <CardDescription>
                  Showing {forecastData.chart.historical.filter(Boolean).length} days of historical data and {forecastData.forecast.length} days of forecast
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-[320px] w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </div>
              ) : forecastData ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={forecastData.chart.labels.map((label: string, i: number) => ({
                      date: label,
                      historical: forecastData.chart.historical[i],
                      forecast: forecastData.chart.predicted[i],
                      lowerBound: forecastData.chart.lowerBound[i],
                      upperBound: forecastData.chart.upperBound[i],
                      reorderPoint: forecastData.reorderPoint
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="historical" 
                        name="Historical Data" 
                        stroke="#8884d8" 
                        strokeWidth={2} 
                        dot={{ r: 3 }} 
                        activeDot={{ r: 5 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="forecast" 
                        name="Forecast" 
                        stroke="#82ca9d" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBound" 
                        name="Lower Bound" 
                        stroke="#d4d4d4" 
                        strokeWidth={1} 
                        strokeDasharray="3 3" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upperBound" 
                        name="Upper Bound" 
                        stroke="#d4d4d4" 
                        strokeWidth={1} 
                        strokeDasharray="3 3" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reorderPoint" 
                        name="Reorder Point" 
                        stroke="#ff8042" 
                        strokeWidth={2} 
                        dot={false}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={forecastData.chart.labels.map((label: string, i: number) => ({
                      date: label,
                      historical: forecastData.chart.historical[i],
                      forecast: forecastData.chart.predicted[i],
                      lowerBound: forecastData.chart.lowerBound[i],
                      upperBound: forecastData.chart.upperBound[i],
                      reorderPoint: forecastData.reorderPoint
                    }))}>
                      <defs>
                        <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="historical" 
                        name="Historical Data" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorHistorical)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="forecast" 
                        name="Forecast" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fillOpacity={1} 
                        fill="url(#colorForecast)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="reorderPoint" 
                        name="Reorder Point" 
                        stroke="#ff8042" 
                        strokeWidth={2} 
                        dot={false}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Select an item to see forecast</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" /> 
              Forecast uses ARIMA (AutoRegressive Integrated Moving Average) time series modeling
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Insights & Recommendations
              </CardTitle>
              <CardDescription>
                {forecastData?.item ? `For ${forecastData.item.name} (${forecastData.item.sku})` : 'Select an item to view insights'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-[90%]" />
                  <Skeleton className="h-5 w-[80%]" />
                  <Skeleton className="h-5 w-[85%]" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : forecastData ? (
                <div>
                  <ul className="space-y-4">
                    {forecastData.insights.map((insight: string, idx: number) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full" />
                        </div>
                        <p>{insight}</p>
                      </li>
                    ))}
                    
                    {/* Add conditional recommendation based on forecast */}
                    {forecastData.forecast[0] < forecastData.reorderPoint * 1.1 && (
                      <li className="flex gap-2 items-start">
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        </div>
                        <p>
                          <strong>Action needed:</strong> Stock level projected to approach reorder point soon. Consider placing an order to avoid stockout.
                        </p>
                      </li>
                    )}
                  </ul>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Key Numbers:</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Current Stock:</span>
                      <span className="font-medium">{forecastData.chart.historical.filter(Boolean).pop()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Projected in {forecastData.forecast.length} days:</span>
                      <span className="font-medium">{Math.round(forecastData.forecast[forecastData.forecast.length-1])}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reorder Point:</span>
                      <span className="font-medium">{forecastData.reorderPoint}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Select an item to view insights</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => {
                  if (forecastData && forecastData.item) {
                    toast.success(`Generated purchase recommendation for ${forecastData.item.name}`);
                  }
                }}
                disabled={!forecastData || loading}
              >
                Generate Purchase Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartReportForecast;
