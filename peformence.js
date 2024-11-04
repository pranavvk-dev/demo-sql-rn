export class PerformanceMonitor {
    static startTime = 0;
  
    static start() {
      this.startTime = performance.now();
    }
  
    static end(operation, dataSize) {
      const endTime = performance.now();
      const duration = endTime - this.startTime;
      const sizeInMB = (dataSize / (1024 * 1024)).toFixed(2);
      const rate = (dataSize / duration / 1024).toFixed(2);
      
      const metrics = {
        operation,
        duration: duration.toFixed(2),
        dataSize: sizeInMB,
        rate: rate,
        timestamp: new Date().toISOString()
      };
  
      console.log(`
  Performance Metrics:
  Operation: ${metrics.operation}
  Duration: ${metrics.duration}ms
  Data Size: ${metrics.dataSize}MB
  Rate: ${metrics.rate}KB/ms
      `);
      
      return metrics;
    }
  }