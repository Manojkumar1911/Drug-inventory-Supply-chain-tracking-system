
import { toast } from "sonner";

// Types for our metrics
interface PerformanceMetrics {
  // Core Web Vitals & Performance
  fcp: number | null;  // First Contentful Paint
  lcp: number | null;  // Largest Contentful Paint
  fid: number | null;  // First Input Delay
  cls: number | null;  // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  
  // User Interaction
  avgPageLoadTime: number | null;
  avgApiResponseTime: number | null;
  
  // App Specific
  inventoryOperations: {
    createProduct: number | null;
    updateProduct: number | null;
    transferProduct: number | null;
    generateForecast: number | null;
  };
  
  // Error Rates
  errorCount: {
    api4xx: number;
    api5xx: number;
    jsErrors: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private apiStartTimes: Map<string, number>;
  private apiEndpoints: string[];
  
  constructor() {
    this.metrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      avgPageLoadTime: null,
      avgApiResponseTime: null,
      inventoryOperations: {
        createProduct: null,
        updateProduct: null,
        transferProduct: null,
        generateForecast: null,
      },
      errorCount: {
        api4xx: 0,
        api5xx: 0,
        jsErrors: 0,
      }
    };
    
    this.apiStartTimes = new Map();
    this.apiEndpoints = [
      '/products',
      '/alerts',
      '/analytics',
      '/users',
      '/locations',
      '/suppliers',
      '/transfers'
    ];
    
    // Initialize monitoring
    this.init();
  }
  
  private init(): void {
    if (typeof window === 'undefined') return;
    
    // Track core web vitals
    this.trackCoreWebVitals();
    
    // Track page load time
    this.trackPageLoadTime();
    
    // Track JS errors
    this.trackJsErrors();
    
    // Track API response times
    this.trackApiPerformance();
  }
  
  private trackCoreWebVitals(): void {
    // Use Performance Observer to track metrics
    try {
      if ('PerformanceObserver' in window) {
        // Track FCP
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            this.metrics.fcp = entries[0].startTime;
            console.log('FCP:', this.metrics.fcp);
          }
        }).observe({ type: 'paint', buffered: true });
        
        // Track LCP
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            // Get the latest entry
            const lcpEntry = entries[entries.length - 1];
            this.metrics.lcp = lcpEntry.startTime;
            console.log('LCP:', this.metrics.lcp);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Track FID
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            this.metrics.fid = entries[0].processingStart - entries[0].startTime;
            console.log('FID:', this.metrics.fid);
          }
        }).observe({ type: 'first-input', buffered: true });
        
        // Track CLS
        let clsValue = 0;
        let clsEntries: any[] = [];
        
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            // Only count layout shifts without recent user input
            if (!(entry as any).hadRecentInput) {
              const firstSessionEntry = clsEntries.length === 0;
              const entryTime = entry.startTime;
              
              // If it's the first entry or occurs less than 1s after the previous entry
              if (firstSessionEntry || entryTime - clsEntries[clsEntries.length - 1].startTime < 1000) {
                clsEntries.push(entry);
              } else {
                // Start a new session
                clsEntries = [entry];
              }
              
              // Calculate CLS for this session
              let sessionValue = 0;
              clsEntries.forEach(sessionEntry => {
                sessionValue += (sessionEntry as any).value;
              });
              
              if (sessionValue > clsValue) {
                clsValue = sessionValue;
                this.metrics.cls = clsValue;
                console.log('CLS:', this.metrics.cls);
              }
            }
          });
        }).observe({ type: 'layout-shift', buffered: true });
      }
      
      // Track TTFB
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        this.metrics.ttfb = (navigationEntries[0] as PerformanceNavigationTiming).responseStart;
        console.log('TTFB:', this.metrics.ttfb);
      }
    } catch (e) {
      console.error('Error tracking Core Web Vitals:', e);
    }
  }
  
  private trackPageLoadTime(): void {
    try {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const pageNavigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (pageNavigation) {
            this.metrics.avgPageLoadTime = pageNavigation.loadEventEnd - pageNavigation.startTime;
            console.log('Page Load Time:', this.metrics.avgPageLoadTime);
          }
        }, 0);
      });
    } catch (e) {
      console.error('Error tracking page load time:', e);
    }
  }
  
  private trackJsErrors(): void {
    try {
      window.addEventListener('error', (event) => {
        this.metrics.errorCount.jsErrors += 1;
        console.log('JS Error:', event.error);
      });
    } catch (e) {
      console.error('Error setting up error tracking:', e);
    }
  }
  
  private trackApiPerformance(): void {
    try {
      // Create a proxy for the fetch function to monitor API calls
      const originalFetch = window.fetch;
      
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.url;
        
        // Check if this is an API endpoint we want to track
        const shouldTrack = this.apiEndpoints.some(endpoint => url.includes(endpoint));
        
        if (shouldTrack) {
          const startTime = performance.now();
          this.apiStartTimes.set(url, startTime);
          
          try {
            const response = await originalFetch(input, init);
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Track average API response time
            if (!this.metrics.avgApiResponseTime) {
              this.metrics.avgApiResponseTime = duration;
            } else {
              this.metrics.avgApiResponseTime = (this.metrics.avgApiResponseTime + duration) / 2;
            }
            
            // Track error rates
            if (response.status >= 400 && response.status < 500) {
              this.metrics.errorCount.api4xx += 1;
            } else if (response.status >= 500) {
              this.metrics.errorCount.api5xx += 1;
            }
            
            console.log(`API ${url} - Response time:`, duration.toFixed(2), 'ms');
            
            return response;
          } catch (error) {
            this.metrics.errorCount.api5xx += 1;
            console.error(`API ${url} - Error:`, error);
            throw error;
          }
        }
        
        return originalFetch(input, init);
      };
    } catch (e) {
      console.error('Error setting up API performance tracking:', e);
    }
  }
  
  // Methods for inventory-specific operations timing
  public startOperationTiming(operation: keyof PerformanceMetrics['inventoryOperations']): void {
    const key = `${operation}_start`;
    (this as any)[key] = performance.now();
  }
  
  public endOperationTiming(operation: keyof PerformanceMetrics['inventoryOperations']): void {
    const startKey = `${operation}_start`;
    if ((this as any)[startKey]) {
      const duration = performance.now() - (this as any)[startKey];
      this.metrics.inventoryOperations[operation] = duration;
      console.log(`Operation ${operation} took ${duration.toFixed(2)} ms`);
    }
  }
  
  // Get current metrics
  public getMetrics(): PerformanceMetrics {
    return this.metrics;
  }
  
  // Log metrics to console
  public logMetrics(): void {
    console.log('Performance Metrics:', this.metrics);
  }
  
  // Save metrics to session storage
  public saveMetrics(): void {
    try {
      sessionStorage.setItem('performanceMetrics', JSON.stringify(this.metrics));
      toast.success("Performance metrics saved to session storage");
    } catch (e) {
      console.error('Error saving metrics:', e);
      toast.error("Failed to save performance metrics");
    }
  }
  
  // Export metrics as JSON file
  public exportMetrics(): void {
    try {
      const dataStr = JSON.stringify(this.metrics, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pharmalink_metrics_${new Date().toISOString()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success("Performance metrics exported successfully");
    } catch (e) {
      console.error('Error exporting metrics:', e);
      toast.error("Failed to export metrics");
    }
  }
}

// Create and export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export the PerformanceMetrics interface
export type { PerformanceMetrics };
