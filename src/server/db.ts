
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Alert from './models/Alert';

dotenv.config();

let connectionInstance: mongoose.Connection | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

const connectDB = () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection string is missing in .env file');
      console.log('\x1b[33m%s\x1b[0m', 'Please create a .env file with MONGODB_URI=your_connection_string');
      return null;
    }
    
    const connection = mongoose.connection;
    
    connection.on('connected', () => {
      console.log('\x1b[32m%s\x1b[0m', '✓ MongoDB connected successfully');
      connectionAttempts = 0;
      
      // Log successful connection to alerts
      createConnectionAlert('Database Connection Established', 
        'MongoDB connection successfully established', 
        'low');
    });
    
    connection.on('error', (err) => {
      console.error('\x1b[31m%s\x1b[0m', '✗ MongoDB connection error:', err);
      
      // Log error to alerts collection if connection was previously established
      if (connectionInstance) {
        createConnectionAlert('Database Connection Error', 
          `MongoDB connection error: ${err.message}`, 
          'high');
      }
    });
    
    connection.on('disconnected', () => {
      console.log('\x1b[33m%s\x1b[0m', 'MongoDB disconnected');
      
      // Attempt to reconnect
      if (connectionAttempts < MAX_RETRIES) {
        console.log('\x1b[33m%s\x1b[0m', `Attempting to reconnect (${connectionAttempts + 1}/${MAX_RETRIES})...`);
        connectionAttempts++;
        setTimeout(() => {
          mongoose.connect(connectionString);
        }, 5000);
      } else {
        console.error('\x1b[31m%s\x1b[0m', 'Max reconnection attempts reached. Please restart the server.');
        createConnectionAlert('Database Connection Failed', 
          'Maximum reconnection attempts reached. Database is not available.', 
          'critical');
      }
    });
    
    // Connect to MongoDB
    mongoose.connect(connectionString);
    connectionInstance = connection;
    
    return mongoose;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:', error);
    return null;
  }
};

async function createConnectionAlert(title: string, description: string, severity: 'critical' | 'high' | 'medium' | 'low') {
  try {
    if (mongoose.connection.readyState === 1) {
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
    }
  } catch (error) {
    console.error('Error creating connection alert:', error);
  }
}

export default connectDB;
