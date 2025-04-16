
import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  requestedBy: { type: String, required: true },
  transferDate: { type: Date, default: Date.now },
  completedDate: { type: Date },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending Approval', 'Approved', 'In Transit', 'Completed', 'Cancelled'],
    default: 'Pending Approval'
  },
  priority: { 
    type: String, 
    enum: ['Urgent', 'High', 'Normal', 'Low'],
    default: 'Normal'
  }
}, { timestamps: true });

const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', transferSchema);

export default Transfer;
