
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  location: string;
  supplier_id?: string;
  manufacturer?: string;
  expiry_date?: Date;
  batch_number?: string;
  cost_price?: number;
  selling_price?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true, default: 'unit' },
  reorder_level: { type: Number, required: true, default: 10 },
  location: { type: String, required: true },
  supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
  manufacturer: { type: String },
  expiry_date: { type: Date },
  batch_number: { type: String },
  cost_price: { type: Number },
  selling_price: { type: Number },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field on save
ProductSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
