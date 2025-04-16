
import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  metricType: { 
    type: String, 
    enum: [
      'inventory_value', 
      'low_stock_items', 
      'expired_items', 
      'inventory_turnover', 
      'sales', 
      'transfers', 
      'reorders'
    ],
    required: true 
  },
  value: { type: Number, required: true },
  location: { type: String },
  category: { type: String },
  notes: { type: String }
}, { timestamps: true });

// Compound index to ensure uniqueness of metrics per day, location, and category
analyticsSchema.index({ date: 1, metricType: 1, location: 1, category: 1 }, { unique: true });

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);

export default Analytics;
