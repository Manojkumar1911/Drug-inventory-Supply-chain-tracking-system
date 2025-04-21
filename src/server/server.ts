
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db';
import initializeDatabase from './initDb';
import { createModels } from './models';

// Routes
import authRoutes, { initAuthRoutes } from './routes/authRoutes';
import productRoutes, { initProductRoutes } from './routes/productRoutes';
import transferRoutes, { initTransferRoutes } from './routes/transferRoutes';
import alertRoutes, { initAlertRoutes } from './routes/alertRoutes';
import locationRoutes, { initLocationRoutes } from './routes/locationRoutes';
import supplierRoutes, { initSupplierRoutes } from './routes/supplierRoutes';
import purchaseOrderRoutes, { initPurchaseOrderRoutes } from './routes/purchaseOrderRoutes';
import settingsRoutes, { initSettingsRoutes } from './routes/settingsRoutes';
import analyticsRoutes, { initAnalyticsRoutes } from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
async function startServer() {
  try {
    // Initialize database connection
    const pool = await initDb();
    console.log('Database connection established');
    
    // Initialize database if needed
    const initialized = await initializeDatabase();
    if (initialized) {
      console.log('Database schema initialized successfully');
    }

    // Create models
    const models = createModels(pool);

    // Initialize routes with pool
    app.use('/api/auth', initAuthRoutes(pool));
    app.use('/api/products', initProductRoutes(pool));
    app.use('/api/transfers', initTransferRoutes(pool));
    app.use('/api/alerts', initAlertRoutes(pool));
    app.use('/api/locations', initLocationRoutes(pool));
    app.use('/api/suppliers', initSupplierRoutes(pool));
    app.use('/api/purchase-orders', initPurchaseOrderRoutes(pool));
    app.use('/api/settings', initSettingsRoutes(pool));
    app.use('/api/analytics', initAnalyticsRoutes(pool));

    // Database connection status endpoint
    app.get('/api/system/status', async (_req: Request, res: Response) => {
      const pgStatus = {
        connected: false,
        status: 'disconnected'
      };

      try {
        await pool.query('SELECT 1');
        pgStatus.connected = true;
        pgStatus.status = 'connected';
      } catch (error) {
        pgStatus.connected = false;
        pgStatus.status = 'error';
        console.error('Database status check error:', error);
      }

      res.json({
        server: {
          status: 'running',
          uptime: process.uptime(),
          timestamp: new Date()
        },
        database: pgStatus
      });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Server shutting down...');
      pool.end();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(err => {
  console.error('Server startup error:', err);
});
