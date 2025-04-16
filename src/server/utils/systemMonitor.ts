
import { EventEmitter } from 'events';
import mongoose from 'mongoose';
import Product from '../models/Product';
import Alert from '../models/Alert';

class SystemMonitor extends EventEmitter {
  private monitoringActive: boolean = false;
  private monitoringIntervals: NodeJS.Timeout[] = [];

  constructor() {
    super();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.on('lowStock', async (product) => {
      try {
        console.log(`Low stock alert triggered for ${product.name}`);
        await this.createAlert({
          title: 'Low Stock Alert',
          description: `${product.name} (SKU: ${product.sku}) is below reorder level. Current quantity: ${product.quantity}, Reorder level: ${product.reorderLevel}`,
          severity: 'high',
          status: 'New',
          category: 'Inventory',
          location: product.location,
        });
      } catch (error) {
        console.error('Error handling low stock event:', error);
      }
    });

    this.on('expiryAlert', async (product) => {
      try {
        const daysToExpiry = Math.ceil((product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        console.log(`Expiry alert triggered for ${product.name}. ${daysToExpiry} days until expiry.`);
        
        await this.createAlert({
          title: 'Product Expiry Alert',
          description: `${product.name} (SKU: ${product.sku}) will expire in ${daysToExpiry} days. Location: ${product.location}, Quantity: ${product.quantity}`,
          severity: daysToExpiry <= 15 ? 'critical' : 'medium',
          status: 'New',
          category: 'Expiry',
          location: product.location,
        });
      } catch (error) {
        console.error('Error handling expiry event:', error);
      }
    });
  }

  private async createAlert(alertData: any) {
    try {
      const alert = new Alert({
        ...alertData,
        timestamp: new Date()
      });
      await alert.save();
      console.log('Alert created successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  startMonitoring() {
    if (this.monitoringActive) return;
    
    console.log('Starting system monitoring...');
    this.monitoringActive = true;
    
    // Check for low stock items every hour
    this.monitoringIntervals.push(setInterval(async () => {
      if (!mongoose.connection.readyState) return;
      
      try {
        const lowStockItems = await Product.find({
          $expr: { $lt: ["$quantity", "$reorderLevel"] }
        }).exec();
        
        for (const item of lowStockItems) {
          this.emit('lowStock', item);
        }
      } catch (error) {
        console.error('Error monitoring low stock:', error);
      }
    }, 60 * 60 * 1000)); // Every hour
    
    // Check for expiring items daily
    this.monitoringIntervals.push(setInterval(async () => {
      if (!mongoose.connection.readyState) return;
      
      try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const expiringItems = await Product.find({
          expiryDate: { $ne: null, $lt: thirtyDaysFromNow }
        }).exec();
        
        for (const item of expiringItems) {
          this.emit('expiryAlert', item);
        }
      } catch (error) {
        console.error('Error monitoring expiry dates:', error);
      }
    }, 24 * 60 * 60 * 1000)); // Every 24 hours
  }

  stopMonitoring() {
    console.log('Stopping system monitoring...');
    this.monitoringActive = false;
    
    for (const interval of this.monitoringIntervals) {
      clearInterval(interval);
    }
    
    this.monitoringIntervals = [];
  }
}

export default new SystemMonitor();
