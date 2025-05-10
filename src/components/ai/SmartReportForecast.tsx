import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, BarChart as BarChartIcon, LineChart as LineChartIcon, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as echarts from 'echarts/core';
import { BarChart as EChartsBarChart } from 'echarts/charts';
import { LineChart as EChartsLineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// Register the required components for ECharts
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  EChartsBarChart,
  EChartsLineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// Type definitions for our data models
interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  reorder_level: number;
  location: string;
  manufacturer: string;
  sku: string;
  date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface ForecastResult {
  dates: string[];
  forecast: number[];
  lower_bound: number[];
  upper_bound: number[];
  rmse: number;
  mape: number;
}

interface ForecastConfig {
  productId: number | null;
  productName: string;
  periods: number;
  seasonalPeriods: number;
  interval: 'days' | 'weeks' | 'months';
  startDate: string;
  endDate: string;
  confidenceInterval: number;
  includeHistorical: boolean;
}

// Only capture needed types, we're not able to import ARIMA fully on the frontend
interface ArimaParams {
  p: number;
  d: number;
  q: number;
  P?: number;
  D?: number;
  Q?: number;
  s?: number;
}

// Color palettes for charts
const colorPalette = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
];

// Gradient generator for cards
const generateGradient = (color1: string, color2: string) => `linear-gradient(to right, ${color1}, ${color2})`;

// Utility function to format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

const SmartReportForecast: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Forecast configuration with defaults
  const [config, setConfig] = useState<ForecastConfig>({
    productId: null,
    productName: '',
    periods: 14,
    seasonalPeriods: 7, // weekly seasonality
    interval: 'days',
    startDate: '', // Will be set after products are loaded
    endDate: '',   // Will be set after products are loaded
    confidenceInterval: 95,
    includeHistorical: true,
  });
  
  const [arimaParams, setArimaParams] = useState<ArimaParams>({
    p: 1,
    d: 1,
    q: 1,
    P: 0,
    D: 0,
    Q: 0,
    s: 7, // Default seasonal period
  });
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    
    // Set default date range (last 60 days to today)
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    setConfig(prev => ({
      ...prev,
      startDate: sixtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    }));
  }, []);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setProducts(data);
        // If there are products, select the first one by default
        if (data.length > 0) {
          setSelectedProductId(data[0].id);
          setConfig(prev => ({
            ...prev,
            productId: data[0].id,
            productName: data[0].name,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products from the database.");
      toast.error("Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Generate ARIMA forecast using Supabase Edge Function
  const generateForecast = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product first");
      return;
    }
    
    setIsGeneratingForecast(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No active session found. Please login again.");
      }
      
      const response = await fetch("https://labzxhoshhzfixlzccrw.supabase.co/functions/v1/generate-arima-forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          productId: selectedProductId,
          periods: config.periods,
          interval: config.interval,
          startDate: config.startDate,
          endDate: config.endDate,
          confidenceInterval: config.confidenceInterval,
          includeHistorical: config.includeHistorical,
          arimaParams: advancedMode ? arimaParams : undefined,
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate forecast");
      }
      
      setForecastResult(result);
      toast.success("Forecast generated successfully");
    } catch (error: any) {
      console.error("Error generating forecast:", error);
      setError(error.message || "Failed to generate forecast");
      toast.error(error.message || "Failed to generate forecast");
    } finally {
      setIsGeneratingForecast(false);
    }
  };

  const handleProductChange = (productId: number) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setSelectedProductId(productId);
      setConfig(prev => ({
        ...prev,
        productId: productId,
        productName: selectedProduct.name,
      }));
    }
  };

  // Setup chart data for recharts
  const chartData = useMemo(() => {
    if (!forecastResult) return [];
    
    return forecastResult.dates.map((date, index) => {
      return {
        date,
        forecast: Math.round(forecastResult.forecast[index]),
        lowerBound: Math.round(forecastResult.lower_bound[index]),
        upperBound: Math.round(forecastResult.upper_bound[index]),
      };
    });
  }, [forecastResult]);

  // Initialize and update ECharts when data changes
  useEffect(() => {
    if (!forecastResult || chartData.length === 0) return;

    const chartDom = document.getElementById('echart-forecast');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom, 'dark');
    
    const option = {
      title: {
        text: `${config.productName} - Demand Forecast`,
        left: 'center',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const date = params[0].name;
          let tooltip = `<div style="font-weight: bold; margin-bottom: 5px;">${date}</div>`;
          
          params.forEach((param: any) => {
            let color = param.color;
            let value = param.value;
            let name = param.seriesName;
            tooltip += `<div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display:inline-block; width:10px; height:10px; background-color:${color}; border-radius:50%; margin-right:5px;"></span>
              <span>${name}: ${value}</span>
            </div>`;
          });
          
          return tooltip;
        }
      },
      legend: {
        data: ['Forecast', 'Lower Bound', 'Upper Bound'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: forecastResult.dates,
        axisLabel: {
          rotate: 45,
          interval: Math.floor(forecastResult.dates.length / 10)
        }
      },
      yAxis: {
        type: 'value',
        name: 'Quantity',
        nameLocation: 'middle',
        nameGap: 50
      },
      series: [
        {
          name: 'Forecast',
          type: chartType,
          data: forecastResult.forecast.map(Math.round),
          smooth: true,
          lineStyle: {
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 5
          },
          itemStyle: {
            color: '#5470c6'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: 'Lower Bound',
          type: 'line',
          data: forecastResult.lower_bound.map(Math.round),
          lineStyle: {
            width: 2,
            type: 'dashed',
            opacity: 0.7
          },
          itemStyle: {
            color: '#91cc75'
          }
        },
        {
          name: 'Upper Bound',
          type: 'line',
          data: forecastResult.upper_bound.map(Math.round),
          lineStyle: {
            width: 2,
            type: 'dashed',
            opacity: 0.7
          },
          itemStyle: {
            color: '#fac858'
          },
          markArea: {
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.1)'
            },
            data: forecastResult.dates.map((_, i) => [
              { 
                yAxis: forecastResult.lower_bound[i],
                xAxis: forecastResult.dates[i]
              },
              { 
                yAxis: forecastResult.upper_bound[i],
                xAxis: forecastResult.dates[i] 
              }
            ])
          }
        }
      ]
    };
    
    myChart.setOption(option);
    
    // Handle resize
    const handleResize = () => {
      myChart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [forecastResult, chartType, chartData, config.productName]);

  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  const toggleChartType = () => {
    setChartType(chartType === 'line' ? 'bar' : 'line');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Statistical accuracy metrics
  const accuracyMetrics = useMemo(() => {
    if (!forecastResult) return null;
    
    return {
      rmse: forecastResult.rmse.toFixed(2),
      mape: (forecastResult.mape * 100).toFixed(2) + '%'
    };
  }, [forecastResult]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-background/80 to-background border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ARIMA Demand Forecasting
          </CardTitle>
          <CardDescription>
            Predict future inventory demands using advanced time series analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="product-select">Product</Label>
              <Select
                value={selectedProductId?.toString()}
                onValueChange={(value) => handleProductChange(parseInt(value))}
                disabled={isLoadingProducts || isGeneratingForecast}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center py-2">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Loading products...</span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="py-2 px-4 text-center">
                      <AlertCircle className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                      <p className="text-sm text-muted-foreground">No products found</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forecast-periods">Forecast Periods</Label>
              <Select
                value={config.periods.toString()}
                onValueChange={(value) => setConfig({ ...config, periods: parseInt(value) })}
                disabled={isGeneratingForecast}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select periods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 periods</SelectItem>
                  <SelectItem value="14">14 periods</SelectItem>
                  <SelectItem value="30">30 periods</SelectItem>
                  <SelectItem value="60">60 periods</SelectItem>
                  <SelectItem value="90">90 periods</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval-select">Interval</Label>
              <Select
                value={config.interval}
                onValueChange={(value: 'days' | 'weeks' | 'months') => setConfig({ ...config, interval: value })}
                disabled={isGeneratingForecast}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range and Advanced Settings */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow space-y-2 min-w-[200px]">
              <div className="flex items-center justify-between">
                <Label htmlFor="date-range">Historical Data Range</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={toggleSettings}
                >
                  {showSettings ? 'Hide Settings' : 'Show Settings'}
                  {showSettings ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date" className="sr-only">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                    disabled={isGeneratingForecast}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="sr-only">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                    disabled={isGeneratingForecast}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={generateForecast}
              disabled={isLoadingProducts || isGeneratingForecast || !selectedProductId}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[120px]"
            >
              {isGeneratingForecast ? (
                <><LoadingSpinner size="xs" className="mr-2" /> Generating...</>
              ) : (
                'Generate Forecast'
              )}
            </Button>
          </div>

          {/* Advanced Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 bg-card/50 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="advanced-mode" 
                      checked={advancedMode} 
                      onCheckedChange={() => toggleAdvancedMode()}
                    />
                    <Label htmlFor="advanced-mode">Enable Advanced ARIMA Parameters</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-historical" 
                      checked={config.includeHistorical} 
                      onCheckedChange={() => setConfig({...config, includeHistorical: !config.includeHistorical})}
                    />
                    <Label htmlFor="include-historical">Include Historical Data in Chart</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="confidence-interval">Confidence Interval (%)</Label>
                    <Select
                      value={config.confidenceInterval.toString()}
                      onValueChange={(value) => setConfig({ ...config, confidenceInterval: parseInt(value) })}
                      disabled={isGeneratingForecast}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select confidence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                        <SelectItem value="99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="chart-type">Chart Type</Label>
                    <div className="flex space-x-2 mt-1">
                      <Button 
                        variant={chartType === 'line' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setChartType('line')}
                        className="flex-1"
                      >
                        <LineChartIcon className="mr-1 h-4 w-4" />
                        Line
                      </Button>
                      <Button 
                        variant={chartType === 'bar' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setChartType('bar')}
                        className="flex-1"
                      >
                        <BarChartIcon className="mr-1 h-4 w-4" />
                        Bar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ARIMA Parameters (only visible in advanced mode) */}
              {advancedMode && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">ARIMA Model Parameters</h4>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    <div>
                      <Label htmlFor="p-param">p (AR)</Label>
                      <Input 
                        id="p-param" 
                        type="number"
                        min="0" 
                        max="10" 
                        value={arimaParams.p}
                        onChange={(e) => setArimaParams({...arimaParams, p: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="d-param">d (Diff)</Label>
                      <Input 
                        id="d-param" 
                        type="number" 
                        min="0" 
                        max="2" 
                        value={arimaParams.d}
                        onChange={(e) => setArimaParams({...arimaParams, d: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="q-param">q (MA)</Label>
                      <Input 
                        id="q-param" 
                        type="number" 
                        min="0" 
                        max="10" 
                        value={arimaParams.q}
                        onChange={(e) => setArimaParams({...arimaParams, q: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="P-param">P (SAR)</Label>
                      <Input 
                        id="P-param" 
                        type="number" 
                        min="0" 
                        max="2" 
                        value={arimaParams.P}
                        onChange={(e) => setArimaParams({...arimaParams, P: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="D-param">D (SDiff)</Label>
                      <Input 
                        id="D-param" 
                        type="number" 
                        min="0" 
                        max="1" 
                        value={arimaParams.D}
                        onChange={(e) => setArimaParams({...arimaParams, D: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="Q-param">Q (SMA)</Label>
                      <Input 
                        id="Q-param" 
                        type="number" 
                        min="0" 
                        max="2" 
                        value={arimaParams.Q}
                        onChange={(e) => setArimaParams({...arimaParams, Q: parseInt(e.target.value)})}
                        disabled={isGeneratingForecast}
                      />
                    </div>
                    
                    <div className="col-span-3 sm:col-span-2">
                      <Label htmlFor="s-param">s (Season Length)</Label>
                      <Select
                        value={arimaParams.s?.toString()}
                        onValueChange={(value) => setArimaParams({...arimaParams, s: parseInt(value)})}
                        disabled={isGeneratingForecast}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Season length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 (Weekly)</SelectItem>
                          <SelectItem value="12">12 (Monthly)</SelectItem>
                          <SelectItem value="30">30 (Monthly days)</SelectItem>
                          <SelectItem value="4">4 (Quarterly)</SelectItem>
                          <SelectItem value="52">52 (Yearly weeks)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Chart */}
          {isGeneratingForecast ? (
            <div className="h-80 flex flex-col items-center justify-center bg-card/50 rounded-lg border">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Generating forecast, please wait...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a few moments.</p>
            </div>
          ) : forecastResult ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="h-[400px] rounded-xl overflow-hidden border bg-card/30 backdrop-blur-sm">
                <div id="echart-forecast" className="w-full h-full"></div>
              </div>
              
              {accuracyMetrics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Model Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-xl font-bold text-blue-900 dark:text-blue-200">{accuracyMetrics.mape}</div>
                      <p className="text-xs text-blue-700 dark:text-blue-400">Mean Absolute Percentage Error</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/40">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Root Mean Square Error</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-xl font-bold text-green-900 dark:text-green-200">{accuracyMetrics.rmse}</div>
                      <p className="text-xs text-green-700 dark:text-green-400">Lower is better</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/40">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">Forecasted Average</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-xl font-bold text-purple-900 dark:text-purple-200">
                        {Math.round(forecastResult.forecast.reduce((a, b) => a + b, 0) / forecastResult.forecast.length)}
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-400">Units per {config.interval}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">Next Period Forecast</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-xl font-bold text-amber-900 dark:text-amber-200">
                        {Math.round(forecastResult.forecast[0])}
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Range: {Math.round(forecastResult.lower_bound[0])} - {Math.round(forecastResult.upper_bound[0])}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="border rounded-lg h-80 flex flex-col items-center justify-center text-center p-6 bg-card/50">
              <div className="text-6xl mb-4 text-muted-foreground/50">📊</div>
              <h3 className="text-lg font-medium mb-1">Generate Your First Forecast</h3>
              <p className="text-muted-foreground max-w-md">
                Select a product and click "Generate Forecast" to predict future inventory demands using the ARIMA model
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartReportForecast;
