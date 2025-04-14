
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  location: { type: String, required: true },
  expiryDate: { type: Date },
  reorderLevel: { type: Number, required: true },
  manufacturer: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
