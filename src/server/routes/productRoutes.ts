
import express, { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import Product from '../models/Product';
import { authenticateToken } from './authRoutes';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// CSV Upload route for Products
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
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

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().lean();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create new product
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get products that need to be reordered (below reorder level)
router.get('/reorder', async (_req: Request, res: Response) => {
  try {
    const productsToReorder = await Product.find({
      $expr: { $lt: ["$quantity", "$reorderLevel"] }
    }).lean();
    return res.json(productsToReorder);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
