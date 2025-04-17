
import express from 'express';
import Analytics from '../models/Analytics';
import { authenticateToken } from './authRoutes';

const router = express.Router();

// Get analytics data
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, metricType, location, category } = req.query;
    
    let query: any = {};
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate as string), 
        $lte: new Date(endDate as string) 
      };
    }
    
    if (metricType) {
      query.metricType = metricType;
    }
    
    if (location) {
      query.location = location;
    }
    
    if (category) {
      query.category = category;
    }
    
    const analytics = await Analytics.find(query).sort({ date: 1 }).lean().exec();
    return res.json(analytics);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Create analytics data
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, metricType, value, location, category, notes } = req.body;
    
    // Check if analytics entry already exists for this date/metric/location/category
    const existingMetric = await Analytics.findOne({
      date: new Date(date),
      metricType,
      location: location || null,
      category: category || null
    }).exec();
    
    if (existingMetric) {
      // Update existing metric
      existingMetric.value = value;
      existingMetric.notes = notes || existingMetric.notes;
      
      const updatedMetric = await existingMetric.save();
      return res.json(updatedMetric);
    } else {
      // Create new metric
      const metric = new Analytics({
        date: new Date(date),
        metricType,
        value,
        location,
        category,
        notes
      });
      
      const savedMetric = await metric.save();
      return res.status(201).json(savedMetric);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error saving analytics', error });
  }
});

export default router;
