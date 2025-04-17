
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import connectDB from './db';
import initializeDatabase from './initDb';
import { createModels } from './models';

// Routes
import authRoutes, { authenticateToken } from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import transferRoutes from './routes/transferRoutes';
import alertRoutes, { initAlertRoutes } from './routes/alertRoutes';
import locationRoutes, { initLocationRoutes } from './routes/locationRoutes';
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

// Connect to PostgreSQL
const pool = connectDB() as Pool;

// Initialize database if needed
if (pool) {
  initializeDatabase()
    .then((initialized) => {
      if (initialized) {
        console.log('Database schema initialized successfully');
      }
    })
    .catch(error => {
      console.error('Failed to initialize database schema:', error);
    });
}

// Create models
const models = pool ? createModels(pool) : null;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/alerts', initAlertRoutes(pool));
app.use('/api/locations', initLocationRoutes(pool));
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database connection status endpoint
app.get('/api/system/status', async (_req, res) => {
  const pgStatus = {
    connected: false,
    status: 'disconnected'
  };

  if (pool) {
    try {
      await pool.query('SELECT 1');
      pgStatus.connected = true;
      pgStatus.status = 'connected';
    } catch (error) {
      pgStatus.connected = false;
      pgStatus.status = 'error';
      console.error('Database status check error:', error);
    }
  }

  return res.json({
    server: {
      status: 'running',
      uptime: process.uptime(),
      timestamp: new Date()
    },
    database: pgStatus
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`PostgreSQL connection status: ${pool ? 'OK' : 'Failed'}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  if (pool) {
    pool.end();
  }
  process.exit(0);
});
