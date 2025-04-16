
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'USA' },
  taxId: { type: String },
  paymentTerms: { type: String },
  leadTime: { type: Number }, // in days
  minimumOrderAmount: { type: Number },
  notes: { type: String },
  isActive: { type: Boolean, default: true },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5,
    default: 3
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { timestamps: true });

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);

export default Supplier;
