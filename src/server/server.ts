
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import systemMonitor from './utils/systemMonitor';
import dbHealthCheck from './utils/dbHealthCheck';

// Routes
import authRoutes, { authenticateToken } from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import transferRoutes from './routes/transferRoutes';
import alertRoutes from './routes/alertRoutes';
import locationRoutes from './routes/locationRoutes';
import supplierRoutes from './routes/supplierRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import settingsRoutes from './routes/settingsRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const dbConnection = connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database connection status endpoint
app.get('/api/system/status', async (_req, res) => {
  const mongoStatus = {
    connected: false,
    status: 'disconnected'
  };

  const readyState = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  if (dbConnection) {
    const state = dbConnection.connection?.readyState || 0;
    mongoStatus.connected = state === 1;
    mongoStatus.status = readyState[state as keyof typeof readyState] || 'unknown';
  }

  return res.json({
    server: {
      status: 'running',
      uptime: process.uptime(),
      timestamp: new Date()
    },
    database: mongoStatus,
    monitoring: {
      systemMonitorActive: systemMonitor.monitoringActive || false,
      dbHealthCheckActive: dbHealthCheck.isMonitoring || false
    }
  });
});

// Start automated monitoring
app.post('/api/system/monitoring/start', authenticateToken, (_req, res) => {
  try {
    systemMonitor.startMonitoring();
    dbHealthCheck.startMonitoring();
    return res.json({ message: 'System monitoring started successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error starting monitoring', error });
  }
});

// Stop automated monitoring
app.post('/api/system/monitoring/stop', authenticateToken, (_req, res) => {
  try {
    systemMonitor.stopMonitoring();
    dbHealthCheck.stopMonitoring();
    return res.json({ message: 'System monitoring stopped successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error stopping monitoring', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connection status: ${dbConnection ? 'OK' : 'Failed'}`);
  
  // Start system monitoring
  try {
    systemMonitor.startMonitoring();
    dbHealthCheck.startMonitoring();
    console.log('Automatic system monitoring started');
  } catch (error) {
    console.error('Failed to start system monitoring:', error);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  systemMonitor.stopMonitoring();
  dbHealthCheck.stopMonitoring();
  process.exit(0);
});
