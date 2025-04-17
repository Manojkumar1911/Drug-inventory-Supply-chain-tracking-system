
import { Pool } from 'pg';
import AlertModel from '../models/Alert';

interface DatabaseStatus {
  status: 'connected' | 'disconnected' | 'error';
  lastCheckedAt: Date;
  error?: any;
  responseTime?: number;
}

// Singleton to track database health
export class DatabaseHealthMonitor {
  private static _instance: DatabaseHealthMonitor;
  private pool: Pool;
  private alertModel: AlertModel;
  private status: DatabaseStatus = {
    status: 'disconnected',
    lastCheckedAt: new Date(),
  };
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor(pool: Pool, alertModel: AlertModel) {
    this.pool = pool;
    this.alertModel = alertModel;
  }

  public static getInstance(pool: Pool, alertModel: AlertModel): DatabaseHealthMonitor {
    if (!DatabaseHealthMonitor._instance) {
      DatabaseHealthMonitor._instance = new DatabaseHealthMonitor(pool, alertModel);
    }
    return DatabaseHealthMonitor._instance;
  }

  // Start monitoring at regular intervals
  public startMonitoring(intervalMs = 60000): void {
    this.checkHealth();

    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, intervalMs);
  }

  public stopMonitoring(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Get current database status
  public getStatus(): DatabaseStatus {
    return { ...this.status };
  }

  // Check database connection health
  private async checkHealth(): Promise<void> {
    const startTime = Date.now();
    try {
      // Test connection with a simple query
      await this.pool.query('SELECT 1 AS connection_test');

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Connection is working
      const previousStatus = this.status.status;
      
      this.status = {
        status: 'connected',
        lastCheckedAt: new Date(),
        responseTime,
      };

      // If we've recovered from a disconnected state, create a recovery alert
      if (previousStatus === 'error' || previousStatus === 'disconnected') {
        await this.createConnectionRecoveryAlert(responseTime);
      }
    } catch (error) {
      this.status = {
        status: 'error',
        lastCheckedAt: new Date(),
        error,
      };

      // Create an alert for the connection failure
      await this.createConnectionFailureAlert(error);
    }
  }

  // Create alert for database connection failure
  private async createConnectionFailureAlert(error: any): Promise<void> {
    try {
      await this.alertModel.create({
        title: 'Database Connection Error',
        description: `Database connection failed: ${error.message || 'Unknown error'}`,
        severity: 'critical',
        status: 'New',
        category: 'System',
        location: 'Database'
      });
    } catch (err) {
      console.error('Failed to create connection failure alert:', err);
    }
  }

  // Create alert for database connection recovery
  private async createConnectionRecoveryAlert(responseTime: number): Promise<void> {
    try {
      await this.alertModel.create({
        title: 'Database Connection Restored',
        description: `Database connection has been restored. Response time: ${responseTime}ms`,
        severity: 'low',
        status: 'New',
        category: 'System',
        location: 'Database'
      });
    } catch (err) {
      console.error('Failed to create connection recovery alert:', err);
    }
  }
}

export default DatabaseHealthMonitor;
