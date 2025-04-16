
import mongoose from 'mongoose';
import Alert from '../models/Alert';

class DatabaseHealthCheck {
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private lastConnectionState: number = 0;

  startMonitoring(interval: number = 5 * 60 * 1000) { // Default 5 minutes
    if (this.isMonitoring) return;
    
    console.log('Starting database health monitoring...');
    this.isMonitoring = true;
    this.lastConnectionState = mongoose.connection.readyState;
    
    this.monitoringInterval = setInterval(() => {
      this.checkDatabaseHealth();
    }, interval);
  }

  stopMonitoring() {
    if (!this.isMonitoring || !this.monitoringInterval) return;
    
    console.log('Stopping database health monitoring...');
    clearInterval(this.monitoringInterval);
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  private async checkDatabaseHealth() {
    try {
      const currentState = mongoose.connection.readyState;
      
      // Connection state changed
      if (currentState !== this.lastConnectionState) {
        console.log(`Database connection state changed from ${this.getReadyStateText(this.lastConnectionState)} to ${this.getReadyStateText(currentState)}`);
        
        // If disconnected
        if (currentState === 0) {
          await this.createConnectionAlert('Database Disconnected', 
            'MongoDB connection lost. System functionality may be impaired.', 
            'critical');
        }
        
        // If reconnected
        if (this.lastConnectionState === 0 && currentState === 1) {
          await this.createConnectionAlert('Database Reconnected', 
            'MongoDB connection re-established. System returning to normal operation.',
            'low');
        }
        
        this.lastConnectionState = currentState;
      }
      
      // If connected, check response time
      if (currentState === 1) {
        await this.checkResponseTime();
      }
      
    } catch (error) {
      console.error('Error checking database health:', error);
    }
  }
  
  private async checkResponseTime() {
    try {
      const start = Date.now();
      
      // Simple ping to check DB response time
      await mongoose.connection.db.admin().ping();
      
      const responseTime = Date.now() - start;
      console.log(`Database response time: ${responseTime}ms`);
      
      // Alert if response time is too high (over 1 second)
      if (responseTime > 1000) {
        await this.createConnectionAlert('Database Performance Issue', 
          `Slow database response time detected (${responseTime}ms). This may affect system performance.`,
          'medium');
      }
    } catch (error) {
      console.error('Error checking database response time:', error);
    }
  }
  
  private getReadyStateText(state: number): string {
    switch (state) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }
  
  private async createConnectionAlert(title: string, description: string, severity: 'critical' | 'high' | 'medium' | 'low') {
    try {
      const alert = new Alert({
        title,
        description,
        severity,
        status: 'New',
        category: 'System',
        location: 'Database',
        timestamp: new Date()
      });
      
      await alert.save();
      console.log(`Database alert created: ${title}`);
    } catch (error) {
      console.error('Error creating database alert:', error);
    }
  }
}

export default new DatabaseHealthCheck();
