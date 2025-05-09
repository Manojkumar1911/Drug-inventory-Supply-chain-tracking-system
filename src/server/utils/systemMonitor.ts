
import mongoose from 'mongoose';
import Product from '../models/Product';
import Location from '../models/Location';
import Transfer from '../models/Transfer';
import Alert from '../models/Alert';

export const initMonitoring = () => {
  console.log('Initializing system monitoring...');
  
  // Schedule monitoring tasks
  setInterval(checkLowStockLevels, 24 * 60 * 60 * 1000); // Once a day
  setInterval(checkExpiringProducts, 24 * 60 * 60 * 1000); // Once a day

  // Run initial checks
  checkLowStockLevels();
  checkExpiringProducts();
};

const checkLowStockLevels = async () => {
  try {
    console.log('Checking for low stock levels...');
    
    const lowStockProducts = await Product.find({ 
      quantity: { $lt: mongoose.Types.ObjectId('$reorderLevel') } 
    });
    
    for (const product of lowStockProducts) {
      // Check if an alert already exists
      const existingAlert = await Alert.findOne({
        product_id: product._id,
        type: 'low_stock',
        status: 'active'
      });
      
      if (!existingAlert) {
        // Create new alert
        const alert = new Alert({
          type: 'low_stock',
          severity: 'high',
          message: `Low stock alert for ${product.name}. Current quantity: ${product.quantity}, Reorder level: ${product.reorderLevel}`,
          product_id: product._id,
          status: 'active',
          created_at: new Date()
        });
        
        await alert.save();
        console.log(`Created low stock alert for ${product.name}`);
      }
    }
    
  } catch (error) {
    console.error('Error checking low stock levels:', error);
  }
};

const checkExpiringProducts = async () => {
  try {
    console.log('Checking for expiring products...');
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringProducts = await Product.find({
      expiration_date: { 
        $exists: true, 
        $ne: null,
        $lte: thirtyDaysFromNow 
      }
    });
    
    for (const product of expiringProducts) {
      // Check if an alert already exists
      const existingAlert = await Alert.findOne({
        product_id: product._id,
        type: 'expiring_soon',
        status: 'active'
      });
      
      if (!existingAlert) {
        // Create new alert
        const alert = new Alert({
          type: 'expiring_soon',
          severity: 'medium',
          message: `Product ${product.name} will expire on ${product.expiration_date.toLocaleDateString()}`,
          product_id: product._id,
          status: 'active',
          created_at: new Date()
        });
        
        await alert.save();
        console.log(`Created expiration alert for ${product.name}`);
      }
    }
    
  } catch (error) {
    console.error('Error checking expiring products:', error);
  }
};
