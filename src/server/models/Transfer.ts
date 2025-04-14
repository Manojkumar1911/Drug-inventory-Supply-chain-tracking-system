
import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  requestedBy: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending Approval', 'Approved', 'In Transit', 'Completed', 'Cancelled'],
    default: 'Pending Approval'
  },
  priority: { 
    type: String, 
    enum: ['Urgent', 'High', 'Normal', 'Low'],
    default: 'Normal'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', transferSchema);

export default Transfer;
