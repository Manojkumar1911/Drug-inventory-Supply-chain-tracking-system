
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db';
import Product from './models/Product';
import Transfer from './models/Transfer';
import Alert from './models/Alert';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Transfer routes
app.get('/api/transfers', async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/transfers', async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    const savedTransfer = await transfer.save();
    res.status(201).json(savedTransfer);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Alert routes
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
