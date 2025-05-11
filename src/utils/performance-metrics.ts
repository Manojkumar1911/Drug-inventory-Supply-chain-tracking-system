
// Performance Monitoring Utility

interface PerformanceMeasure {
  name: string;
  value: number;
  unit: string;
}

interface PerformanceMetrics {
  navigation: {
    type: string;
    redirectCount: number;
    loadEventTime: number;
    domContentLoadedTime: number;
    domInteractiveTime: number;
    domCompleteTime: number;
  };
  timing: {
    fetchStart: number;
    domainLookupStart: number;
    domainLookupEnd: number;
    connectStart: number;
    connectEnd: number;
    secureConnectionStart: number;
    requestStart: number;
    responseStart: number;
    responseEnd: number;
    domLoading: number;
    domInteractive: number;
    domContentLoadedEventStart: number;
    domContentLoadedEventEnd: number;
    domComplete: number;
    loadEventStart: number;
    loadEventEnd: number;
  };
  paint: {
    firstPaint: number;
    firstContentfulPaint: number;
  };
  memory: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  measures: PerformanceMeasure[];
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private timeOrigin: number;
  private customMeasures: Map<string, PerformanceMeasure> = new Map();

  constructor() {
    this.timeOrigin = performance.timeOrigin || 0;

    // Set up listeners for performance events
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        // Observe paint events
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-paint') {
              this.addCustomMeasure('firstPaint', entry.startTime, 'ms');
            } else if (entry.name === 'first-contentful-paint') {
              this.addCustomMeasure('firstContentfulPaint', entry.startTime, 'ms');
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        // Observe long tasks
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log('Long task detected:', entry);
            this.addCustomMeasure('longTask', entry.duration, 'ms');
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Observe layout shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          let cumulativeLayoutShift = 0;
          list.getEntries().forEach((entry) => {
            // @ts-ignore: LayoutShift is a web API type not in TypeScript
            if (!entry.hadRecentInput) {
              // @ts-ignore
              cumulativeLayoutShift += entry.value;
            }
          });
          this.addCustomMeasure('cumulativeLayoutShift', cumulativeLayoutShift, '');
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.addCustomMeasure('largestContentfulPaint', lastEntry.startTime, 'ms');
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe first input delay
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.addCustomMeasure('firstInputDelay', entry.processingStart - entry.startTime, 'ms');
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

      } catch (e) {
        console.warn('Performance observer not fully supported', e);
      }
    }
  }

  /**
   * Start measuring a specific operation
   */
  public startMeasure(name: string): void {
    if (typeof performance.mark === 'function') {
      try {
        performance.mark(`${name}-start`);
      } catch (e) {
        console.warn(`Failed to start performance measure: ${name}`, e);
      }
    }
  }

  /**
   * End measuring a specific operation and record it
   */
  public endMeasure(name: string): void {
    if (typeof performance.mark === 'function' && typeof performance.measure === 'function') {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);

        // Record the measure
        const entries = performance.getEntriesByName(name, 'measure');
        if (entries.length > 0) {
          this.addCustomMeasure(name, entries[0].duration, 'ms');
        }
      } catch (e) {
        console.warn(`Failed to end performance measure: ${name}`, e);
      }
    }
  }

  /**
   * Add a custom performance measure
   */
  public addCustomMeasure(name: string, value: number, unit: string): void {
    this.customMeasures.set(name, { name, value, unit });
  }

  /**
   * Collect all performance metrics
   */
  public collectMetrics(): PerformanceMetrics {
    // Navigation timing
    let timing: any = {};
    let memory: any = { jsHeapSizeLimit: 0, totalJSHeapSize: 0, usedJSHeapSize: 0 };
    let navigation: any = {};
    let paint: any = { firstPaint: 0, firstContentfulPaint: 0 };

    if (window.performance) {
      // Get navigation timing data
      if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        timing = {
          fetchStart: navEntry.fetchStart,
          domainLookupStart: navEntry.domainLookupStart,
          domainLookupEnd: navEntry.domainLookupEnd,
          connectStart: navEntry.connectStart,
          connectEnd: navEntry.connectEnd,
          secureConnectionStart: navEntry.secureConnectionStart,
          requestStart: navEntry.requestStart,
          responseStart: navEntry.responseStart,
          responseEnd: navEntry.responseEnd,
          domLoading: navEntry.domContentLoadedEventStart - navEntry.fetchStart,
          domInteractive: navEntry.domInteractive - navEntry.fetchStart,
          domContentLoadedEventStart: navEntry.domContentLoadedEventStart - navEntry.fetchStart,
          domContentLoadedEventEnd: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
          domComplete: navEntry.domComplete - navEntry.fetchStart,
          loadEventStart: navEntry.loadEventStart - navEntry.fetchStart,
          loadEventEnd: navEntry.loadEventEnd - navEntry.fetchStart,
        };
        
        navigation = {
          type: navEntry.type,
          redirectCount: navEntry.redirectCount,
          loadEventTime: navEntry.loadEventEnd - navEntry.loadEventStart,
          domContentLoadedTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          domInteractiveTime: navEntry.domInteractive - navEntry.fetchStart,
          domCompleteTime: navEntry.domComplete - navEntry.fetchStart,
        };
      } else if ((performance as any).timing) {
        // Fallback for older browsers
        const t = (performance as any).timing;
        
        timing = {
          navigationStart: 0,
          fetchStart: t.fetchStart - t.navigationStart,
          domainLookupStart: t.domainLookupStart - t.navigationStart,
          domainLookupEnd: t.domainLookupEnd - t.navigationStart,
          connectStart: t.connectStart - t.navigationStart,
          connectEnd: t.connectEnd - t.navigationStart,
          secureConnectionStart: t.secureConnectionStart ? t.secureConnectionStart - t.navigationStart : 0,
          requestStart: t.requestStart - t.navigationStart,
          responseStart: t.responseStart - t.navigationStart,
          responseEnd: t.responseEnd - t.navigationStart,
          domLoading: t.domLoading - t.navigationStart,
          domInteractive: t.domInteractive - t.navigationStart,
          domContentLoadedEventStart: t.domContentLoadedEventStart - t.navigationStart,
          domContentLoadedEventEnd: t.domContentLoadedEventEnd - t.navigationStart,
          domComplete: t.domComplete - t.navigationStart,
          loadEventStart: t.loadEventStart - t.navigationStart,
          loadEventEnd: t.loadEventEnd - t.navigationStart
        };
        
        navigation = {
          type: (performance as any).navigation?.type || 'unknown',
          redirectCount: (performance as any).navigation?.redirectCount || 0,
          loadEventTime: t.loadEventEnd - t.loadEventStart,
          domContentLoadedTime: t.domContentLoadedEventEnd - t.domContentLoadedEventStart,
          domInteractiveTime: t.domInteractive - t.navigationStart,
          domCompleteTime: t.domComplete - t.navigationStart
        };
      }

      // Get paint metrics
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          paint.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          paint.firstContentfulPaint = entry.startTime;
        }
      });

      // Get memory info if available (Chrome only)
      if ((performance as any).memory) {
        memory = {
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize
        };
      }
    }

    // Compile and store all metrics
    this.metrics = {
      navigation,
      timing,
      paint,
      memory,
      measures: Array.from(this.customMeasures.values())
    };

    return this.metrics;
  }

  /**
   * Log all performance metrics to console
   */
  public logMetrics(): void {
    const metrics = this.collectMetrics();
    
    console.group('📊 Performance Metrics');
    
    console.log('⏱️ Navigation Timing:');
    console.table({
      'Load Time': `${Math.round(metrics.navigation.loadEventTime)}ms`,
      'DOMContentLoaded': `${Math.round(metrics.navigation.domContentLoadedTime)}ms`,
      'DOM Interactive': `${Math.round(metrics.navigation.domInteractiveTime)}ms`,
      'DOM Complete': `${Math.round(metrics.navigation.domCompleteTime)}ms`,
    });
    
    console.log('🎨 Paint Metrics:');
    console.table({
      'First Paint': `${Math.round(metrics.paint.firstPaint)}ms`,
      'First Contentful Paint': `${Math.round(metrics.paint.firstContentfulPaint)}ms`,
    });
    
    if (metrics.memory.jsHeapSizeLimit > 0) {
      console.log('💾 Memory Usage:');
      console.table({
        'Used JS Heap': `${Math.round(metrics.memory.usedJSHeapSize / 1048576)}MB`,
        'Total JS Heap': `${Math.round(metrics.memory.totalJSHeapSize / 1048576)}MB`,
        'JS Heap Limit': `${Math.round(metrics.memory.jsHeapSizeLimit / 1048576)}MB`,
      });
    }
    
    if (metrics.measures.length > 0) {
      console.log('📏 Custom Measurements:');
      const customData: Record<string, string> = {};
      metrics.measures.forEach(measure => {
        customData[measure.name] = `${Math.round(measure.value * 100) / 100}${measure.unit}`;
      });
      console.table(customData);
    }
    
    console.log('🔍 Detailed Timing:');
    console.table({
      'DNS Lookup': `${Math.round(metrics.timing.domainLookupEnd - metrics.timing.domainLookupStart)}ms`,
      'TCP Connection': `${Math.round(metrics.timing.connectEnd - metrics.timing.connectStart)}ms`,
      'Request': `${Math.round(metrics.timing.responseStart - metrics.timing.requestStart)}ms`,
      'Response': `${Math.round(metrics.timing.responseEnd - metrics.timing.responseStart)}ms`,
      'DOM Processing': `${Math.round(metrics.timing.domComplete - metrics.timing.responseEnd)}ms`,
    });
    
    console.groupEnd();
  }

  /**
   * Save metrics to sessionStorage for later analysis
   */
  public saveMetrics(): void {
    const metrics = this.collectMetrics();
    try {
      sessionStorage.setItem('performanceMetrics', JSON.stringify(metrics));
      console.info('Performance metrics saved to sessionStorage');
    } catch (e) {
      console.warn('Failed to save performance metrics to sessionStorage', e);
    }
  }

  /**
   * Get previously saved metrics
   */
  public getSavedMetrics(): PerformanceMetrics | null {
    try {
      const savedMetrics = sessionStorage.getItem('performanceMetrics');
      return savedMetrics ? JSON.parse(savedMetrics) : null;
    } catch (e) {
      console.warn('Failed to retrieve saved performance metrics', e);
      return null;
    }
  }

  /**
   * Clear all custom measures
   */
  public clearMeasures(): void {
    this.customMeasures.clear();
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks();
    }
    if (typeof performance.clearMeasures === 'function') {
      performance.clearMeasures();
    }
  }
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();
