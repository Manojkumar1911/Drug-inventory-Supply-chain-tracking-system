
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      console.error('MongoDB connection string is missing in .env file');
      return;
    }
    
    await mongoose.connect(connectionString);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
