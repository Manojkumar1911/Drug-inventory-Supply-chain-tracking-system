
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import locationRoutes from './routes/locationRoutes';
import alertRoutes from './routes/alertRoutes';
import productRoutes from './routes/productRoutes';
import transferRoutes from './routes/transferRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import supplierRoutes from './routes/supplierRoutes';
import settingsRoutes from './routes/settingsRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pharma-inventory');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDb();

// Initialize health check
const initHealthCheck = (app: express.Application) => {
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
};

// Initialize monitoring
const initMonitoring = () => {
  // Check for low stock and expiring products
  setInterval(async () => {
    // Monitoring logic would go here
    console.log('Running monitoring checks...');
  }, 24 * 60 * 60 * 1000); // Run once a day
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/settings', settingsRoutes);

// Health check route
initHealthCheck(app);

// Start monitoring
initMonitoring();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
