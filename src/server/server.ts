
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import connectDB from './db';
import Product from './models/Product';
import Transfer from './models/Transfer';
import Alert from './models/Alert';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// CSV Upload route for Products
app.post('/api/upload/products', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results: any[] = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await Product.insertMany(results);
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({ 
      message: 'CSV uploaded successfully', 
      count: results.length 
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error processing CSV', error });
    return;
  }
});

// Product routes
app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
    return;
  }
});

// Transfer routes
app.get('/api/transfers', async (_req, res) => {
  try {
    const transfers = await Transfer.find({});
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
});

// Alert routes
app.get('/api/alerts', async (_req, res) => {
  try {
    const alerts = await Alert.find({});
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
