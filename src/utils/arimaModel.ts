
/**
 * ARIMA Model Implementation for Pharmaceutical Inventory Forecasting
 * 
 * This module provides functions to forecast inventory demands using the ARIMA 
 * (AutoRegressive Integrated Moving Average) model, a popular statistical method
 * for time series forecasting.
 */

// Helper function to calculate mean of an array
const calculateMean = (data: number[]): number => {
  return data.reduce((sum, value) => sum + value, 0) / data.length;
};

// Helper function to calculate autocorrelation at lag k
const calculateAutocorrelation = (data: number[], k: number): number => {
  const mean = calculateMean(data);
  const n = data.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let t = k; t < n; t++) {
    numerator += (data[t] - mean) * (data[t - k] - mean);
  }
  
  for (let t = 0; t < n; t++) {
    denominator += Math.pow(data[t] - mean, 2);
  }
  
  return numerator / denominator;
};

// Helper function to calculate partial autocorrelation at lag k
const calculatePartialAutocorrelation = (data: number[], k: number): number => {
  if (k === 0) {
    return 1;
  }
  
  if (k === 1) {
    return calculateAutocorrelation(data, 1);
  }
  
  const yule_walker = Array(k).fill(0).map(() => Array(k).fill(0));
  const autocorrelations = Array(k + 1).fill(0);
  
  for (let i = 0; i <= k; i++) {
    autocorrelations[i] = calculateAutocorrelation(data, i);
  }
  
  for (let i = 0; i < k; i++) {
    yule_walker[i][0] = autocorrelations[i + 1];
    
    for (let j = 1; j < k; j++) {
      if (i >= j) {
        yule_walker[i][j] = autocorrelations[i - j + 1];
      } else {
        yule_walker[i][j] = autocorrelations[j - i + 1];
      }
    }
  }
  
  // Solve Yule-Walker equations using Levinson-Durbin recursion
  const solution = levinsonDurbin(yule_walker, autocorrelations.slice(1, k + 1));
  
  return solution[solution.length - 1];
};

// Implementation of Levinson-Durbin algorithm to solve Yule-Walker equations
const levinsonDurbin = (matrix: number[][], vector: number[]): number[] => {
  const n = vector.length;
  const solution = Array(n).fill(0);
  
  if (n === 1) {
    solution[0] = vector[0] / matrix[0][0];
    return solution;
  }
  
  // Forward substitution
  const temp = Array(n).fill(0);
  temp[0] = vector[0] / matrix[0][0];
  
  for (let i = 1; i < n; i++) {
    let sum = 0;
    
    for (let j = 0; j < i; j++) {
      sum += matrix[i][j] * temp[j];
    }
    
    temp[i] = (vector[i] - sum) / matrix[i][i];
  }
  
  // Backward substitution
  solution[n - 1] = temp[n - 1];
  
  for (let i = n - 2; i >= 0; i--) {
    let sum = 0;
    
    for (let j = i + 1; j < n; j++) {
      sum += matrix[i][j] * solution[j];
    }
    
    solution[i] = temp[i] - sum;
  }
  
  return solution;
};

// Function to difference the time series data
const differenceSeries = (data: number[], d: number = 1): number[] => {
  if (d <= 0) return [...data];
  
  const diffed = [];
  for (let i = 1; i < data.length; i++) {
    diffed.push(data[i] - data[i - 1]);
  }
  
  return d === 1 ? diffed : differenceSeries(diffed, d - 1);
};

// Function to un-difference the time series data
const undifferenceSeries = (diffedData: number[], originalData: number[], d: number = 1): number[] => {
  if (d <= 0) return [...diffedData];
  
  const result = [originalData[originalData.length - 1]];
  
  for (let i = 0; i < diffedData.length; i++) {
    result.push(result[i] + diffedData[i]);
  }
  
  return d === 1 ? result : undifferenceSeries(result, originalData, d - 1);
};

// Main ARIMA forecast function
export interface ArimaParams {
  p: number; // Auto-regressive order
  d: number; // Differencing order
  q: number; // Moving average order
}

export interface ArimaForecastResult {
  forecast: number[];
  confidenceBounds: {
    lower: number[];
    upper: number[];
  };
  originalData: number[];
  trend?: 'increasing' | 'decreasing' | 'stable';
  seasonality?: 'strong' | 'moderate' | 'weak' | 'none';
  anomalies?: number[];
}

/**
 * Forecast future values using ARIMA model
 * @param data Historical time series data
 * @param steps Number of steps to forecast
 * @param params ARIMA parameters (p, d, q)
 * @param confidenceLevel Confidence level for prediction intervals (default: 0.95)
 */
export const arimaForecast = (
  data: number[], 
  steps: number, 
  params: ArimaParams = { p: 1, d: 1, q: 1 },
  confidenceLevel: number = 0.95
): ArimaForecastResult => {
  if (data.length < Math.max(params.p, params.q) + params.d + 1) {
    throw new Error("Insufficient data points for the specified ARIMA parameters");
  }
  
  // Difference the series
  const diffedData = differenceSeries(data, params.d);
  
  // Determine AR coefficients using Yule-Walker equations
  const arCoefficients = Array(params.p).fill(0);
  for (let i = 0; i < params.p; i++) {
    arCoefficients[i] = calculatePartialAutocorrelation(diffedData, i + 1);
  }
  
  // Estimate residuals
  const residuals: number[] = [];
  for (let i = params.p; i < diffedData.length; i++) {
    let predicted = 0;
    for (let j = 0; j < params.p; j++) {
      predicted += arCoefficients[j] * diffedData[i - j - 1];
    }
    residuals.push(diffedData[i] - predicted);
  }
  
  // Calculate standard error for confidence bounds
  const standardError = Math.sqrt(
    residuals.reduce((sum, r) => sum + r * r, 0) / residuals.length
  );
  
  // Calculate z-score for the given confidence level
  const zScore = 1.96; // Approximately 95% confidence level
  
  // Generate forecasts
  const forecastDiffed: number[] = [];
  for (let i = 0; i < steps; i++) {
    let forecast = 0;
    
    // AR component
    for (let j = 0; j < params.p; j++) {
      const prevValue = i - j - 1 < 0 
        ? diffedData[diffedData.length + (i - j - 1)] 
        : forecastDiffed[i - j - 1];
      forecast += arCoefficients[j] * prevValue;
    }
    
    // MA component (simplified)
    // In a more complete implementation, we would use actual MA coefficients here
    
    forecastDiffed.push(forecast);
  }
  
  // Revert differencing to get actual forecasts
  const forecast = undifferenceSeries(forecastDiffed, data, params.d);
  
  // Calculate confidence bounds
  const lower = forecast.map(f => f - zScore * standardError);
  const upper = forecast.map(f => f + zScore * standardError);
  
  // Determine trend
  const recentValues = data.slice(-5);
  const trend = determineTrend(recentValues);
  
  // Determine seasonality
  const seasonality = determineSeasonality(data);
  
  // Detect anomalies
  const anomalies = detectAnomalies(data);
  
  return {
    forecast: forecast,
    confidenceBounds: {
      lower,
      upper
    },
    originalData: data,
    trend,
    seasonality,
    anomalies
  };
};

// Helper function to determine trend
const determineTrend = (data: number[]): 'increasing' | 'decreasing' | 'stable' => {
  if (data.length < 2) return 'stable';
  
  let increasing = 0;
  let decreasing = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i] > data[i-1]) increasing++;
    else if (data[i] < data[i-1]) decreasing++;
  }
  
  if (increasing > data.length * 0.7) return 'increasing';
  if (decreasing > data.length * 0.7) return 'decreasing';
  return 'stable';
};

// Helper function to determine seasonality (simplified)
const determineSeasonality = (data: number[]): 'strong' | 'moderate' | 'weak' | 'none' => {
  if (data.length < 12) return 'none';
  
  // Check for correlation at different seasonal lags
  const acf7 = Math.abs(calculateAutocorrelation(data, 7));  // Weekly
  const acf30 = Math.abs(calculateAutocorrelation(data, 30)); // Monthly
  
  const maxCorr = Math.max(acf7, acf30);
  
  if (maxCorr > 0.7) return 'strong';
  if (maxCorr > 0.4) return 'moderate';
  if (maxCorr > 0.2) return 'weak';
  return 'none';
};

// Helper function to detect anomalies (simple outlier detection)
const detectAnomalies = (data: number[]): number[] => {
  const mean = calculateMean(data);
  const stdDev = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
  );
  
  const anomalies: number[] = [];
  
  // Mark points that are 3 standard deviations away from the mean
  for (let i = 0; i < data.length; i++) {
    if (Math.abs(data[i] - mean) > 3 * stdDev) {
      anomalies.push(i);
    }
  }
  
  return anomalies;
};

/**
 * Auto-detect the best ARIMA parameters based on time series data
 * Uses a simplified implementation of auto.arima from R
 */
export const autoArima = (data: number[], maxP: number = 5, maxD: number = 2, maxQ: number = 5): ArimaParams => {
  // Simple implementation - in practice, this would use AIC or BIC to select the best model
  // For now, we'll use a grid search approach with a simple MSE criterion
  
  let bestParams: ArimaParams = { p: 1, d: 1, q: 1 };
  let bestError = Infinity;
  
  // Simplified auto-detection - test different d values first
  for (let d = 0; d <= Math.min(2, maxD); d++) {
    // Try basic AR models
    for (let p = 1; p <= Math.min(3, maxP); p++) {
      for (let q = 0; q <= Math.min(2, maxQ); q++) {
        try {
          const testParams = { p, d, q };
          
          // Test the model by doing a one-step forecast on historical data
          const error = testArimaModel(data, testParams);
          
          if (error < bestError) {
            bestError = error;
            bestParams = testParams;
          }
        } catch (e) {
          // Skip invalid parameter combinations
          continue;
        }
      }
    }
  }
  
  return bestParams;
};

// Test an ARIMA model by doing one-step forecasts on historical data
const testArimaModel = (data: number[], params: ArimaParams): number => {
  const testSize = Math.min(10, Math.floor(data.length / 3));
  let squaredErrors = 0;
  
  for (let i = 0; i < testSize; i++) {
    const trainingData = data.slice(0, data.length - testSize + i);
    const actualValue = data[data.length - testSize + i];
    
    try {
      const forecast = arimaForecast(trainingData, 1, params);
      squaredErrors += Math.pow(forecast.forecast[0] - actualValue, 2);
    } catch (e) {
      return Infinity; // Invalid model
    }
  }
  
  return squaredErrors / testSize;
};

/**
 * Generate a forecast report with insights about future inventory levels
 */
export const generateForecastReport = (
  itemName: string,
  historicalData: number[],
  forecastSteps: number = 7,
  reorderPoint?: number
): {
  forecast: number[];
  insights: string[];
  chart: {
    labels: string[];
    historical: number[];
    predicted: number[];
    lowerBound: number[];
    upperBound: number[];
  }
} => {
  // Auto-detect the best ARIMA parameters
  const bestParams = autoArima(historicalData);
  
  // Generate forecast
  const result = arimaForecast(historicalData, forecastSteps, bestParams);
  
  // Prepare data for chart
  const today = new Date();
  const labels = Array.from({ length: historicalData.length + forecastSteps }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - historicalData.length + i);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  // Generate insights
  const insights: string[] = [];
  
  // Add trend insight
  if (result.trend === 'increasing') {
    insights.push(`${itemName} usage is trending upward. Expect increased demand.`);
  } else if (result.trend === 'decreasing') {
    insights.push(`${itemName} usage is trending downward. Consider adjusting stock levels.`);
  } else {
    insights.push(`${itemName} usage is relatively stable.`);
  }
  
  // Add forecast summary
  const avgForecast = result.forecast.reduce((sum, val) => sum + val, 0) / result.forecast.length;
  const lastActual = historicalData[historicalData.length - 1];
  
  if (avgForecast > lastActual * 1.2) {
    insights.push(`Forecast shows a significant increase of ${Math.round((avgForecast/lastActual - 1) * 100)}% compared to current levels.`);
  } else if (avgForecast < lastActual * 0.8) {
    insights.push(`Forecast shows a significant decrease of ${Math.round((1 - avgForecast/lastActual) * 100)}% compared to current levels.`);
  }
  
  // Add seasonality insight
  if (result.seasonality === 'strong' || result.seasonality === 'moderate') {
    insights.push(`This item shows ${result.seasonality} seasonal patterns. Consider historical seasonal demand when planning.`);
  }
  
  // Add reorder point insight
  if (reorderPoint !== undefined) {
    const daysBeforeReorder = result.forecast.findIndex(val => val <= reorderPoint);
    
    if (daysBeforeReorder >= 0) {
      insights.push(`Item will reach reorder point in approximately ${daysBeforeReorder + 1} days.`);
    } else {
      insights.push(`Item is not expected to reach reorder point within the forecast period.`);
    }
  }
  
  // Return forecast data and insights
  return {
    forecast: result.forecast,
    insights,
    chart: {
      labels,
      historical: [...historicalData, ...Array(forecastSteps).fill(null)],
      predicted: [...Array(historicalData.length).fill(null), ...result.forecast],
      lowerBound: [...Array(historicalData.length).fill(null), ...result.confidenceBounds.lower],
      upperBound: [...Array(historicalData.length).fill(null), ...result.confidenceBounds.upper]
    }
  };
};
