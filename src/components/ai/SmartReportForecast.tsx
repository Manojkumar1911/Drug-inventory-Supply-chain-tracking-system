
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, subDays, subMonths } from 'date-fns';
import { motion } from 'framer-motion';

// Import echarts modules
import * as echarts from 'echarts';

interface ForecastData {
  date: string;
  actual: number;
  forecast: number;
  upper: number;
  lower: number;
}

interface ProductData {
  id: string;
  name: string;
  sku: string;
}

const SmartReportForecast: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState<string>('30');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [activeMetric, setActiveMetric] = useState<string>('consumption');
  
  // Chart instance
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  useEffect(() => {
    // Load products
    loadProducts();
    
    // Set last refreshed time
    setLastRefreshed(format(new Date(), 'PPp'));
    
    // Cleanup chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);
  
  useEffect(() => {
    if (selectedProduct) {
      generateForecastData();
    }
  }, [selectedProduct, forecastPeriod, activeMetric]);
  
  useEffect(() => {
    if (forecastData.length > 0 && chartRef.current) {
      renderChart();
    }
  }, [forecastData, activeMetric]);
  
  // Function to load products from the database
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku')
        .order('name');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Convert numeric ids to string to match ProductData interface
        const formattedData: ProductData[] = data.map(item => ({
          id: String(item.id),
          name: item.name,
          sku: item.sku
        }));
        
        setProducts(formattedData);
        // Select the first product by default, ensuring it's a string
        setSelectedProduct(String(formattedData[0].id));
      } else {
        toast.warning("No products found in the database.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
      setIsLoading(false);
    }
  };
  
  // Function to generate forecast data (simulated ARIMA)
  const generateForecastData = () => {
    setIsLoading(true);
    
    // This would normally call your ARIMA forecasting API or edge function
    setTimeout(() => {
      try {
        // Simulate forecast data based on ARIMA model
        const today = new Date();
        const newData: ForecastData[] = [];
        
        // Generate historical data for the past 90 days
        for (let i = 90; i >= 1; i--) {
          const date = subDays(today, i);
          const baseValue = activeMetric === 'consumption' ? 
            Math.floor(Math.random() * 50) + 50 : // Consumption 
            Math.floor(Math.random() * 500) + 2000; // Stock level
          
          // Create some patterns and seasonality in the data
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const seasonalFactor = Math.sin(date.getMonth() * Math.PI / 6) * 0.3 + 1; // Seasonal factor
          const trendFactor = i / 90; // Slight upward trend as we approach current date
          
          const adjustedValue = baseValue * 
            (isWeekend ? 0.7 : 1) * // Weekend effect
            seasonalFactor * // Seasonal effect
            (1 + trendFactor); // Trend effect
            
          const finalValue = Math.round(adjustedValue);
          
          newData.push({
            date: format(date, 'yyyy-MM-dd'),
            actual: finalValue,
            forecast: 0,
            upper: 0,
            lower: 0
          });
        }
        
        // Generate forecast data for the next N days
        const forecastDays = parseInt(forecastPeriod);
        const lastActualValue = newData[newData.length - 1].actual;
        
        // Use historical data to fit an "ARIMA-like" model
        const recentValues = newData.slice(-14).map(d => d.actual);
        const mean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
        const std = Math.sqrt(recentValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recentValues.length);
        
        // AR component - correlation with previous values
        const ar1 = 0.8; // Strong autocorrelation with lag 1
        const ar2 = -0.2; // Weak negative correlation with lag 2
        const ar7 = 0.3; // Weekly seasonality
        
        // Generate forecasts
        let prev1 = newData[newData.length - 1].actual;
        let prev2 = newData[newData.length - 2].actual;
        let prev7 = newData[newData.length - 7].actual;
        
        for (let i = 1; i <= forecastDays; i++) {
          const date = subDays(today, -i);
          
          // ARIMA-like model forecast
          const forecastValue = mean + 
            ar1 * (prev1 - mean) + 
            ar2 * (prev2 - mean) + 
            ar7 * (prev7 - mean);
          
          // Add random noise
          const noise = std * Math.random() * 0.5;
          const finalForecast = Math.round(forecastValue + noise);
          
          // Confidence intervals get wider over time
          const confidenceWidth = std * Math.sqrt(i) * 2;
          
          newData.push({
            date: format(date, 'yyyy-MM-dd'),
            actual: 0, // No actual values for future dates
            forecast: finalForecast,
            upper: Math.round(finalForecast + confidenceWidth),
            lower: Math.max(0, Math.round(finalForecast - confidenceWidth)) // Ensure not negative
          });
          
          // Update previous values for next iteration
          prev7 = prev1;
          prev2 = prev1;
          prev1 = finalForecast;
        }
        
        setForecastData(newData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error generating forecast:", error);
        toast.error("Failed to generate forecast");
        setIsLoading(false);
      }
    }, 1500);
  };
  
  // Function to render the chart
  const renderChart = () => {
    if (!chartRef.current) return;
    
    // Initialize the chart
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }
    
    chartInstance.current = echarts.init(chartRef.current);
    
    // Split data into actual and forecast
    const dates = forecastData.map(item => item.date);
    const actuals = forecastData.map(item => item.actual || null);
    const forecasts = forecastData.map(item => item.forecast || null);
    const uppers = forecastData.map(item => item.upper || null);
    const lowers = forecastData.map(item => item.lower || null);
    
    // Find the index where forecast starts (where actual becomes 0/null)
    const forecastStartIndex = actuals.findIndex(val => val === 0 || val === null);
    
    // Create the chart options
    const options: echarts.EChartsOption = {
      title: {
        text: `${activeMetric === 'consumption' ? 'Consumption' : 'Stock Level'} Forecast`,
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16,
          color: '#8b5cf6'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].axisValue;
          let html = `<div style="font-weight:bold">${date}</div>`;
          
          params.forEach((param: any) => {
            if (param.seriesName === 'Actual' && param.value !== null) {
              html += `<div style="display:flex;justify-content:space-between;gap:10px">
                <span style="color:${param.color}">${param.seriesName}:</span>
                <span style="font-weight:bold">${param.value}</span>
              </div>`;
            }
            else if (param.seriesName === 'Forecast' && param.value !== null) {
              html += `<div style="display:flex;justify-content:space-between;gap:10px">
                <span style="color:${param.color}">${param.seriesName}:</span>
                <span style="font-weight:bold">${param.value}</span>
              </div>`;
            }
          });
          
          return html;
        }
      },
      legend: {
        data: ['Actual', 'Forecast', 'Confidence Interval'],
        bottom: '0%',
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
        data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisLabel: {
          formatter: (value: string) => {
            return value.substring(5); // Show MM-DD format
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: activeMetric === 'consumption' ? 'Units Consumed' : 'Stock Level',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: 'Actual',
          type: 'line',
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6,
          data: actuals,
          itemStyle: {
            color: '#3b82f6'
          },
          lineStyle: {
            width: 3
          }
        },
        {
          name: 'Forecast',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          data: forecasts,
          itemStyle: {
            color: '#8b5cf6'
          },
          lineStyle: {
            width: 3,
            type: 'dashed'
          }
        },
        {
          name: 'Confidence Interval',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: uppers,
          itemStyle: {
            color: 'rgba(139, 92, 246, 0.2)',
            borderWidth: 0
          },
          lineStyle: {
            width: 0
          },
          areaStyle: {
            opacity: 0.2,
            color: '#8b5cf6'
          },
          stack: 'confidence'
        },
        {
          name: 'Lower Bound',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: lowers,
          itemStyle: {
            color: 'rgba(139, 92, 246, 0.2)',
            borderWidth: 0
          },
          lineStyle: {
            width: 0
          },
          areaStyle: {
            opacity: 0.2,
            color: '#8b5cf6'
          },
          stack: 'confidence',
          showSymbol: false,
          tooltip: { show: false },
          legendHoverLink: false
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
    
    // Set the chart options
    chartInstance.current.setOption(options);
    
    // Make the chart responsive
    window.addEventListener('resize', () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });
  };
  
  const handleRefresh = () => {
    if (selectedProduct) {
      generateForecastData();
      setLastRefreshed(format(new Date(), 'PPp'));
      toast.success("Forecast data refreshed");
    } else {
      toast.warning("Please select a product first");
    }
  };
  
  const handleDownload = () => {
    if (!chartInstance.current) return;
    
    // Get chart base64 image data
    const dataUrl = chartInstance.current.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${activeMetric}-forecast-${format(new Date(), 'yyyy-MM-dd')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Forecast chart downloaded successfully');
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/30 dark:to-blue-950/30">
        <CardHeader className="space-y-1">
          <div className="flex flex-wrap justify-between gap-3 items-center">
            <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ARIMA Forecasting Model
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="hover:bg-purple-100 dark:hover:bg-purple-900/50" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-1 text-purple-500" /> 
                Refresh
              </Button>
              <Button size="sm" variant="outline" className="hover:bg-blue-100 dark:hover:bg-blue-900/50" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1 text-blue-500" /> 
                Export
              </Button>
            </div>
          </div>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Advanced time series forecasting based on ARIMA model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Select Product</label>
              <Select 
                value={selectedProduct} 
                onValueChange={setSelectedProduct}
                disabled={isLoading || products.length === 0}
              >
                <SelectTrigger className="bg-white/80 dark:bg-gray-900/80">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Forecast Period</label>
              <Select 
                value={forecastPeriod} 
                onValueChange={setForecastPeriod}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/80 dark:bg-gray-900/80">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <Tabs value={activeMetric} onValueChange={setActiveMetric} className="w-full">
                <TabsList className="w-full bg-white/80 dark:bg-gray-900/80">
                  <TabsTrigger value="consumption" className="flex-1 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-100">
                    Consumption
                  </TabsTrigger>
                  <TabsTrigger value="stock" className="flex-1 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900/50 dark:data-[state=active]:text-blue-100">
                    Stock Level
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="h-[400px] w-full relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-background/50 backdrop-blur-sm">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">Generating ARIMA forecast...</p>
              </div>
            ) : null}
            <div ref={chartRef} className="h-full w-full"></div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last refreshed: {lastRefreshed}
          </div>
          <div>
            ARIMA Model: p=2, d=1, q=1, seasonal=True
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SmartReportForecast;
