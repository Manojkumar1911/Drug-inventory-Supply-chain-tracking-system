
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './db';
import Product from './models/Product';
import Transfer from './models/Transfer';
import Alert from './models/Alert';
import User from './models/User';
import Location from './models/Location';
import Supplier from './models/Supplier';
import PurchaseOrder from './models/PurchaseOrder';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.body.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = new User({
      name,
      email,
      password,
      role: role || 'staff'
    });
    
    const savedUser = await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// CSV Upload route for Products
app.post('/api/upload/products', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results: any[] = [];

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(req.file!.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve())
        .on('error', reject);
    });

    await Product.insertMany(results);
    fs.unlinkSync(req.file.path);
    
    return res.status(200).json({ 
      message: 'CSV uploaded successfully', 
      count: results.length 
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Error processing CSV', error });
  }
});

// Product routes
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error });
  }
});

// Transfer routes
app.get('/api/transfers', async (_req: Request, res: Response) => {
  try {
    const transfers = await Transfer.find();
    return res.json(transfers);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/transfers', async (req: Request, res: Response) => {
  try {
    const transfer = new Transfer(req.body);
    const savedTransfer = await transfer.save();
    
    // Update product quantities
    const product = await Product.findById(transfer.product);
    if (product) {
      // Reduce quantity at source location
      if (product.location === transfer.from) {
        product.quantity -= transfer.quantity;
        await product.save();
      }
      
      // Check if product exists at destination
      const destinationProduct = await Product.findOne({ 
        sku: product.sku,
        location: transfer.to
      });
      
      if (destinationProduct) {
        // Update quantity at destination
        destinationProduct.quantity += transfer.quantity;
        await destinationProduct.save();
      } else {
        // Create new product entry at destination
        const newLocationProduct = new Product({
          ...product.toObject(),
          _id: undefined,
          location: transfer.to,
          quantity: transfer.quantity
        });
        await newLocationProduct.save();
      }
    }
    
    return res.status(201).json(savedTransfer);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating transfer', error });
  }
});

// Alert routes
app.get('/api/alerts', async (_req: Request, res: Response) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/alerts', async (req: Request, res: Response) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    return res.status(201).json(savedAlert);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating alert', error });
  }
});

// Location routes
app.get('/api/locations', async (_req: Request, res: Response) => {
  try {
    const locations = await Location.find();
    return res.json(locations);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/locations', async (req: Request, res: Response) => {
  try {
    const location = new Location(req.body);
    const savedLocation = await location.save();
    return res.status(201).json(savedLocation);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating location', error });
  }
});

// Supplier routes
app.get('/api/suppliers', async (_req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find();
    return res.json(suppliers);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/suppliers', async (req: Request, res: Response) => {
  try {
    const supplier = new Supplier(req.body);
    const savedSupplier = await supplier.save();
    return res.status(201).json(savedSupplier);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating supplier', error });
  }
});

// Purchase Order routes
app.get('/api/purchase-orders', async (_req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/api/purchase-orders', async (req: Request, res: Response) => {
  try {
    // Generate order number
    const orderCount = await PurchaseOrder.countDocuments();
    const orderNumber = `PO-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(5, '0')}`;
    
    const purchaseOrder = new PurchaseOrder({
      ...req.body,
      orderNumber
    });
    
    const savedOrder = await purchaseOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating purchase order', error });
  }
});

// User routes
app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    // Don't return password field
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
