/**
 * Performance Monitoring Utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.setupObservers();
  }
  
  setupObservers() {
    // Performance Observer for measuring load times
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration);
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
      this.observers.push(observer);
    }
  }
  
  recordMetric(name, value) {
    this.metrics[name] = {
      value,
      timestamp: Date.now()
    };
    
    console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
  }
  
  startTiming(name) {
    if ('performance' in window) {
      performance.mark(`${name}-start`);
    }
  }
  
  endTiming(name) {
    if ('performance' in window) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }
  }
  
  getMetrics() {
    return this.metrics;
  }
  
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
window.performanceMonitor = new PerformanceMonitor(); 