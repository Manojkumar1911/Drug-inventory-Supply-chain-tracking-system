
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { init, getInstanceByDom } from 'echarts';
import { useTheme } from '@/context/ThemeContext';

interface EChartProps {
  option: echarts.EChartsOption;
  style?: React.CSSProperties;
  className?: string;
}

export const EChart: React.FC<EChartProps> = ({ 
  option, 
  style, 
  className 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Initialize chart
    let chart: echarts.ECharts | undefined;
    
    if (chartRef.current) {
      chart = init(chartRef.current, theme === 'dark' ? 'dark' : undefined);
    }

    // Add window resize listener
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    if (chartRef.current) {
      const chart = getInstanceByDom(chartRef.current) || init(chartRef.current, theme === 'dark' ? 'dark' : undefined);
      chart.setOption(option);
    }
  }, [option, theme]);

  return (
    <div 
      ref={chartRef}
      style={{ width: '100%', height: '100%', ...style }}
      className={className}
    />
  );
};

// Sample Bar Chart
export const BarChart: React.FC<{ data: any[]; xField: string; yField: string; title?: string; colors?: string[] }> = ({ 
  data, 
  xField, 
  yField, 
  title,
  colors = ['#8b5cf6', '#6366f1', '#a855f7']
}) => {
  const option: echarts.EChartsOption = {
    title: title ? { text: title, left: 'center', textStyle: { fontWeight: 'normal' } } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item[xField]),
      axisLabel: {
        interval: 0,
        rotate: data.length > 10 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.map((item, index) => ({
          value: item[yField],
          itemStyle: {
            color: colors[index % colors.length]
          }
        })),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.1)'
        }
      }
    ]
  };

  return <EChart option={option} style={{ height: 400 }} />;
};

// Sample Line Chart
export const LineChart: React.FC<{ 
  data: any[]; 
  xField: string; 
  yField: string | string[];
  title?: string;
  smooth?: boolean;
  areaStyle?: boolean;
  colors?: string[];
}> = ({ 
  data, 
  xField, 
  yField, 
  title,
  smooth = true,
  areaStyle = false,
  colors = ['#8b5cf6', '#6366f1', '#a855f7', '#ec4899', '#0ea5e9']
}) => {
  const yFields = Array.isArray(yField) ? yField : [yField];
  
  const option: echarts.EChartsOption = {
    title: title ? { text: title, left: 'center', textStyle: { fontWeight: 'normal' } } : undefined,
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item[xField])
    },
    yAxis: {
      type: 'value'
    },
    series: yFields.map((field, index) => ({
      name: field,
      type: 'line',
      smooth: smooth,
      data: data.map(item => item[field]),
      itemStyle: {
        color: colors[index % colors.length]
      },
      lineStyle: {
        width: 3
      },
      showSymbol: false,
      areaStyle: areaStyle ? {
        opacity: 0.2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors[index % colors.length]
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, 0.1)'
          }
        ])
      } : undefined
    }))
  };

  return <EChart option={option} style={{ height: 400 }} />;
};

// Sample Pie Chart
export const PieChart: React.FC<{ 
  data: {name: string; value: number}[];
  title?: string;
  doughnut?: boolean;
  colors?: string[];
}> = ({ 
  data, 
  title,
  doughnut = false,
  colors = ['#8b5cf6', '#6366f1', '#a855f7', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']
}) => {
  const option: echarts.EChartsOption = {
    title: title ? { 
      text: title,
      left: 'center',
      textStyle: { fontWeight: 'normal' }
    } : undefined,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      type: 'scroll'
    },
    series: [
      {
        name: title || 'Data',
        type: 'pie',
        radius: doughnut ? ['40%', '70%'] : '70%',
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          ...item,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  };

  return <EChart option={option} style={{ height: 400 }} />;
};

// Custom Chart for Inventory Levels
export const InventoryLevelChart: React.FC<{ 
  data: any[]; 
  title?: string;
}> = ({ data, title }) => {
  const option: echarts.EChartsOption = {
    title: {
      text: title || 'Inventory Levels by Location',
      left: 'center',
      textStyle: {
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const item = params[0];
        return `${item.name}<br/>${item.value} units<br/>Reorder Level: ${item.data.reorderLevel}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.location),
      axisLabel: {
        interval: 0,
        rotate: data.length > 6 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'Units'
    },
    series: [
      {
        name: 'Current Stock',
        type: 'bar',
        data: data.map(item => ({
          value: item.quantity,
          reorderLevel: item.reorderLevel,
          itemStyle: {
            color: item.quantity < item.reorderLevel 
              ? '#ef4444' // Red for low stock
              : (item.quantity < item.reorderLevel * 1.5 
                ? '#f59e0b' // Amber for warning
                : '#10b981') // Green for good
          }
        })),
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Reorder Level',
        type: 'line',
        data: data.map(item => item.reorderLevel),
        symbol: 'none',
        lineStyle: {
          color: '#ef4444',
          type: 'dashed',
          width: 2
        }
      }
    ]
  };

  return <EChart option={option} style={{ height: 400 }} />;
};

// Advanced Forecast Chart with Prediction
export const ForecastChart: React.FC<{ 
  historical: {date: string; value: number}[];
  forecast: {date: string; value: number; lowerBound?: number; upperBound?: number}[];
  title?: string;
}> = ({ historical, forecast, title }) => {
  // Combine all dates for x-axis
  const allDates = [
    ...historical.map(item => item.date),
    ...forecast.map(item => item.date)
  ];

  // Prepare data series
  const historicalData = historical.map(item => item.value);
  const historyDates = historical.map(item => item.date);
  
  const forecastData = allDates.map(date => {
    const forecastPoint = forecast.find(item => item.date === date);
    return forecastPoint ? forecastPoint.value : null;
  });
  
  const lowerBoundData = allDates.map(date => {
    const forecastPoint = forecast.find(item => item.date === date);
    return forecastPoint && forecastPoint.lowerBound !== undefined ? forecastPoint.lowerBound : null;
  });
  
  const upperBoundData = allDates.map(date => {
    const forecastPoint = forecast.find(item => item.date === date);
    return forecastPoint && forecastPoint.upperBound !== undefined ? forecastPoint.upperBound : null;
  });

  const option: echarts.EChartsOption = {
    title: {
      text: title || 'Inventory Forecast',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Historical', 'Forecast', 'Confidence Interval'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: allDates,
      axisLabel: {
        interval: Math.floor(allDates.length / 8),
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: 'Units'
    },
    series: [
      {
        name: 'Historical',
        type: 'line',
        data: allDates.map(date => {
          const index = historyDates.indexOf(date);
          return index >= 0 ? historicalData[index] : null;
        }),
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#6366f1'
        },
        itemStyle: {
          color: '#6366f1'
        }
      },
      {
        name: 'Forecast',
        type: 'line',
        data: forecastData,
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#8b5cf6'
        },
        itemStyle: {
          color: '#8b5cf6'
        }
      },
      {
        name: 'Confidence Interval',
        type: 'line',
        data: upperBoundData,
        lineStyle: {
          opacity: 0
        },
        stack: 'confidence',
        symbol: 'none'
      },
      {
        name: 'Confidence Interval',
        type: 'line',
        data: lowerBoundData,
        lineStyle: {
          opacity: 0
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(139, 92, 246, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(139, 92, 246, 0.1)'
            }
          ])
        },
        stack: 'confidence',
        symbol: 'none'
      }
    ]
  };

  return <EChart option={option} style={{ height: 450 }} />;
};
