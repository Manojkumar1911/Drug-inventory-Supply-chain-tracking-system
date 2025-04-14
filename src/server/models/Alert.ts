
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['New', 'In Progress', 'Resolved'],
    default: 'New'
  },
  category: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);

export default Alert;
