
import express from 'express';
import cors from 'cors';
import { connectDb } from './db';
import { initHealthCheck } from './utils/dbHealthCheck';
import { initMonitoring } from './utils/systemMonitor';

// Import route modules
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
connectDb();

// Initialize system monitoring
initMonitoring();

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
