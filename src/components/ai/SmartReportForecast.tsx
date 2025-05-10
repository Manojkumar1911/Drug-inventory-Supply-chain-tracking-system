
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Area, AreaChart, ComposedChart, Bar, Scatter
} from "recharts";
import { toast } from "sonner";
import { Download, RefreshCw, ChevronDown, Zap, ArrowDownCircle, AlertTriangle, ShieldCheck, Calendar } from "lucide-react";
import { arimaForecast, autoArima, generateForecastReport, ArimaParams } from "@/utils/arimaModel";
import PageLoader from '@/components/ui/page-loader';
import { useTheme } from '@/context/ThemeContext';

const SmartReportForecast: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<string>("antibiotic");
  const [timeframe, setTimeframe] = useState<string>("days");
  const [timeframeValue, setTimeframeValue] = useState<number>(7);
  const [reportData, setReportData] = useState<any>(null);
  const [arimaParams, setArimaParams] = useState<ArimaParams>({ p: 1, d: 1, q: 1 });
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);
  const [isAutoArima, setIsAutoArima] = useState<boolean>(true);
  const [chartType, setChartType] = useState<string>("area");
  const { theme } = useTheme();

  // Sample historical data for different products
  const sampleData: Record<string, number[]> = {
    antibiotic: [245, 258, 274, 265, 262, 289, 291, 304, 315, 302, 312, 318, 325, 336, 340, 348, 360, 352, 348, 370, 360, 355, 372, 380, 390, 385, 400, 410, 405, 415],
    painkiller: [180, 185, 178, 190, 196, 188, 205, 210, 200, 212, 220, 215, 225, 232, 228, 240, 235, 250, 243, 260, 255, 265, 270, 265, 280, 275, 290, 285, 300, 295],
    vitamin: [120, 125, 128, 130, 135, 128, 140, 145, 142, 148, 152, 150, 155, 160, 158, 162, 168, 172, 175, 180, 185, 182, 188, 190, 195, 200, 205, 202, 210, 215],
    cardiovascular: [320, 325, 335, 330, 340, 350, 345, 355, 360, 355, 365, 375, 380, 370, 385, 390, 385, 395, 400, 410, 405, 415, 420, 425, 430, 440, 435, 450, 445, 460],
    respiratory: [210, 215, 220, 218, 225, 230, 228, 235, 240, 238, 245, 250, 248, 255, 260, 258, 265, 270, 275, 280, 285, 290, 288, 295, 300, 305, 310, 315, 318, 325]
  };

  // Initialize and load data
  useEffect(() => {
    const timer = setTimeout(() => {
      generateReport();
      setInitialLoading(false);
    }, 1200); 
    
    return () => clearTimeout(timer);
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    
    try {
      // Get historical data for the selected product
      const historicalData = sampleData[product] || sampleData.antibiotic;
      
      let params = arimaParams;
      if (isAutoArima) {
        // Use auto ARIMA to find optimal parameters
        params = autoArima(historicalData);
        setArimaParams(params);
      }
      
      // Generate forecast report
      const forecastSteps = timeframeValue; 
      const report = generateForecastReport(product, historicalData, forecastSteps);
      
      setReportData(report);
      toast.success(`Forecast generated for ${product}`);
    } catch (error) {
      console.error("Error generating forecast:", error);
      toast.error("Failed to generate forecast");
    } finally {
      setIsLoading(false);
    }
  };

  // Download report as CSV
  const downloadReport = () => {
    if (!reportData) return;
    
    try {
      // Prepare CSV data
      let csvContent = "Date,Historical,Forecast,Lower Bound,Upper Bound\n";
      
      reportData.chart.labels.forEach((label: string, index: number) => {
        const historical = reportData.chart.historical[index] ?? "";
        const forecast = reportData.chart.predicted[index] ?? "";
        const lower = reportData.chart.lowerBound[index] ?? "";
        const upper = reportData.chart.upperBound[index] ?? "";
        
        csvContent += `${label},${historical},${forecast},${lower},${upper}\n`;
      });
      
      // Create and download file
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${product}_forecast_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  if (initialLoading) {
    return <PageLoader message="Initializing ARIMA model..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ARIMA Demand Forecast
          </h2>
          <p className="text-muted-foreground">
            Advanced time series forecasting for inventory optimization
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="antibiotic">Antibiotics</SelectItem>
              <SelectItem value="painkiller">Pain Killers</SelectItem>
              <SelectItem value="vitamin">Vitamins</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
              <SelectItem value="respiratory">Respiratory</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Select value={timeframeValue.toString()} onValueChange={(val) => setTimeframeValue(parseInt(val))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="90">90</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateReport} 
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Generate
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Demand Forecast for {product.charAt(0).toUpperCase() + product.slice(1)}</CardTitle>
                <CardDescription>Predicted demand for the next {timeframeValue} {timeframe}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[130px] h-8">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="composed">Composed Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            {reportData ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart
                    data={reportData.chart.labels.map((label: string, index: number) => ({
                      date: label,
                      historical: reportData.chart.historical[index],
                      forecast: reportData.chart.predicted[index],
                      lowerBound: reportData.chart.lowerBound[index],
                      upperBound: reportData.chart.upperBound[index]
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
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
                      fillOpacity={1} 
                      fill="url(#colorForecast)" 
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      name="Upper Bound"
                      stroke="transparent"
                      fill="#82ca9d"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      name="Lower Bound"
                      stroke="transparent"
                      fill="#82ca9d"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                ) : chartType === 'line' ? (
                  <LineChart
                    data={reportData.chart.labels.map((label: string, index: number) => ({
                      date: label,
                      historical: reportData.chart.historical[index],
                      forecast: reportData.chart.predicted[index],
                      lowerBound: reportData.chart.lowerBound[index],
                      upperBound: reportData.chart.upperBound[index]
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#333' : '#fff',
                        borderColor: theme === 'dark' ? '#555' : '#ddd',
                        color: theme === 'dark' ? '#eee' : '#333'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      name="Historical Data" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={true} 
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      name="Forecast" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      dot={true} 
                      activeDot={{ r: 6 }}
                      strokeDasharray="5 5" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="upperBound" 
                      name="Upper Bound" 
                      stroke="#ff7300" 
                      strokeWidth={1}
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lowerBound" 
                      name="Lower Bound" 
                      stroke="#ff7300" 
                      strokeWidth={1}
                      dot={false} 
                    />
                  </LineChart>
                ) : (
                  <ComposedChart
                    data={reportData.chart.labels.map((label: string, index: number) => ({
                      date: label,
                      historical: reportData.chart.historical[index],
                      forecast: reportData.chart.predicted[index],
                      lowerBound: reportData.chart.lowerBound[index],
                      upperBound: reportData.chart.upperBound[index],
                      deviation: index >= reportData.chart.historical.filter(Boolean).length 
                        ? Math.abs((reportData.chart.upperBound[index] - reportData.chart.lowerBound[index]) / 2) : 0
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#555' : '#ddd'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
                    />
                    <YAxis 
                      stroke={theme === 'dark' ? '#999' : '#666'}
                      tick={{fill: theme === 'dark' ? '#bbb' : '#333'}}
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
                      dataKey="historical"
                      name="Historical Data"
                      fill="rgba(136, 132, 216, 0.3)"
                      stroke="#8884d8"
                    />
                    <Bar 
                      dataKey="forecast" 
                      name="Forecast" 
                      fill="rgba(130, 202, 157, 0.7)" 
                      barSize={20} 
                    />
                    <Line
                      type="monotone"
                      dataKey="upperBound"
                      name="Upper Bound"
                      stroke="#ff7300"
                      dot={false}
                      activeDot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="lowerBound"
                      name="Lower Bound"
                      stroke="#ff7300"
                      dot={false}
                      activeDot={false}
                    />
                    <Scatter 
                      dataKey="deviation" 
                      name="Uncertainty" 
                      fill="#ff7300" 
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Generate a forecast to see data visualization</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Forecast Insights</CardTitle>
            <CardDescription>AI-generated recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportData ? (
              <>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 rounded-lg">
                  <p className="text-sm text-purple-900 dark:text-purple-300 font-medium leading-relaxed">
                    {reportData.forecast.length > 0 
                      ? `Based on ${reportData.chart.historical.filter(Boolean).length} data points, the ARIMA model predicts an average demand of ${Math.round(reportData.forecast.reduce((a: number, b: number) => a + b, 0) / reportData.forecast.length)} units over the next ${timeframeValue} ${timeframe}.`
                      : "Generate a forecast to see insights"}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" /> Key Insights
                  </h4>
                  <ul className="space-y-3">
                    {reportData.insights.map((insight: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        {idx === 0 ? (
                          <ArrowDownCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        ) : idx === 1 ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Model Parameters</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center border border-gray-100 dark:border-gray-700">
                      <div className="font-medium text-gray-600 dark:text-gray-400">p</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{arimaParams.p}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center border border-gray-100 dark:border-gray-700">
                      <div className="font-medium text-gray-600 dark:text-gray-400">d</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{arimaParams.d}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-md text-center border border-gray-100 dark:border-gray-700">
                      <div className="font-medium text-gray-600 dark:text-gray-400">q</div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">{arimaParams.q}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <p>ARIMA({arimaParams.p},{arimaParams.d},{arimaParams.q}) model {isAutoArima ? 'automatically selected' : 'manually configured'}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-gray-500">Generate a forecast to see insights</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={downloadReport} 
              variant="outline" 
              className="w-full" 
              disabled={!reportData}
            >
              <Download className="mr-2 h-4 w-4" /> Download Report
            </Button>
            <div className="flex items-center justify-center w-full text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg">Advanced ARIMA Settings</CardTitle>
          <CardDescription>Fine-tune your forecasting model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Checkbox 
                  id="autoArima" 
                  checked={isAutoArima} 
                  onCheckedChange={() => setIsAutoArima(!isAutoArima)}
                />
                <label htmlFor="autoArima" className="ml-2 text-sm">
                  Auto-detect optimal parameters
                </label>
              </div>
              
              <div className={`grid grid-cols-3 gap-4 ${isAutoArima ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <Label htmlFor="pValue" className="mb-1 block">p (AR term)</Label>
                  <Select 
                    value={arimaParams.p.toString()} 
                    onValueChange={(val) => setArimaParams({...arimaParams, p: parseInt(val)})}
                    disabled={isAutoArima}
                  >
                    <SelectTrigger id="pValue">
                      <SelectValue placeholder="p value" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map(p => (
                        <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dValue" className="mb-1 block">d (Diff term)</Label>
                  <Select 
                    value={arimaParams.d.toString()} 
                    onValueChange={(val) => setArimaParams({...arimaParams, d: parseInt(val)})}
                    disabled={isAutoArima}
                  >
                    <SelectTrigger id="dValue">
                      <SelectValue placeholder="d value" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2].map(d => (
                        <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="qValue" className="mb-1 block">q (MA term)</Label>
                  <Select 
                    value={arimaParams.q.toString()} 
                    onValueChange={(val) => setArimaParams({...arimaParams, q: parseInt(val)})}
                    disabled={isAutoArima}
                  >
                    <SelectTrigger id="qValue">
                      <SelectValue placeholder="q value" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map(q => (
                        <SelectItem key={q} value={q.toString()}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confidenceLevel" className="mb-1 block">Confidence Level</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={confidenceLevel.toString()} 
                  onValueChange={(val) => setConfidenceLevel(parseFloat(val))}
                >
                  <SelectTrigger id="confidenceLevel">
                    <SelectValue placeholder="Confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8">80%</SelectItem>
                    <SelectItem value="0.9">90%</SelectItem>
                    <SelectItem value="0.95">95%</SelectItem>
                    <SelectItem value="0.99">99%</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline"
                  disabled={isAutoArima}
                  onClick={generateReport}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Apply Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReportForecast;
