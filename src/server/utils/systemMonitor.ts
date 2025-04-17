
import { Pool } from 'pg';
import os from 'os';
import AlertModel from '../models/Alert';
import ProductModel from '../models/Product';

export class SystemMonitor {
  private static _instance: SystemMonitor;
  private pool: Pool;
  private alertModel: AlertModel;
  private productModel: ProductModel;
  private monitorInterval: NodeJS.Timeout | null = null;

  private constructor(pool: Pool, alertModel: AlertModel, productModel: ProductModel) {
    this.pool = pool;
    this.alertModel = alertModel;
    this.productModel = productModel;
  }

  public static getInstance(pool: Pool, alertModel: AlertModel, productModel: ProductModel): SystemMonitor {
    if (!SystemMonitor._instance) {
      SystemMonitor._instance = new SystemMonitor(pool, alertModel, productModel);
    }
    return SystemMonitor._instance;
  }

  // Start system monitoring
  public startMonitoring(intervalMs = 300000): void {
    this.checkSystem();

    if (this.monitorInterval !== null) {
      clearInterval(this.monitorInterval);
    }

    this.monitorInterval = setInterval(() => {
      this.checkSystem();
    }, intervalMs);
  }

  public stopMonitoring(): void {
    if (this.monitorInterval !== null) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  // Perform system checks
  private async checkSystem(): Promise<void> {
    await Promise.all([
      this.checkServerResources(),
      this.checkInventoryLevels()
    ]);
  }

  // Check server resources (CPU, memory)
  private async checkServerResources(): Promise<void> {
    try {
      const cpuUsage = os.loadavg()[0] / os.cpus().length; // Normalize by CPU count
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;

      // Create alerts if resources above threshold
      if (cpuUsage > 0.8) { // 80% CPU usage
        await this.alertModel.create({
          title: 'High CPU Usage',
          description: `Server CPU usage is high (${(cpuUsage * 100).toFixed(2)}%)`,
          severity: memUsagePercent > 90 ? 'critical' : 'high',
          status: 'New',
          category: 'System',
          location: 'Server'
        });
      }

      if (memUsagePercent > 85) { // 85% memory usage
        await this.alertModel.create({
          title: 'High Memory Usage',
          description: `Server memory usage is high (${memUsagePercent.toFixed(2)}%)`,
          severity: memUsagePercent > 95 ? 'critical' : 'high',
          status: 'New',
          category: 'System',
          location: 'Server'
        });
      }

      // Record system metrics in analytics table
      await this.pool.query(
        `INSERT INTO analytics 
        (date, metric_type, value, location, category, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          new Date(), 
          'cpu_usage', 
          cpuUsage * 100, 
          'Server',
          'System',
          'Automated system monitor'
        ]
      );

      await this.pool.query(
        `INSERT INTO analytics 
        (date, metric_type, value, location, category, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          new Date(), 
          'memory_usage', 
          memUsagePercent, 
          'Server',
          'System',
          'Automated system monitor'
        ]
      );

    } catch (error) {
      console.error('Error monitoring server resources:', error);
    }
  }

  // Check inventory levels
  private async checkInventoryLevels(): Promise<void> {
    try {
      // Find products that are below reorder level
      const lowStockProducts = await this.productModel.findProductsToReorder();
      
      for (const product of lowStockProducts) {
        // Create alerts for products below threshold
        await this.alertModel.create({
          title: 'Low Inventory Alert',
          description: `${product.name} (SKU: ${product.sku}) is below reorder level. Current quantity: ${product.quantity}, Reorder Level: ${product.reorder_level}`,
          severity: product.quantity === 0 ? 'critical' : (product.quantity < product.reorder_level / 2 ? 'high' : 'medium'),
          status: 'New',
          category: 'Inventory',
          location: product.location
        });
      }
    } catch (error) {
      console.error('Error checking inventory levels:', error);
    }
  }
}

export default SystemMonitor;
