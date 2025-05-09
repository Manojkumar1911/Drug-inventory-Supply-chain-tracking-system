
import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  zip_code: string;
  website?: string;
  lead_time: number;
  minimum_order_amount: number;
  notes?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true },
  contact_person: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String },
  zip_code: { type: String, required: true },
  website: { type: String },
  lead_time: { type: Number, required: true, default: 7 }, // in days
  minimum_order_amount: { type: Number, required: true, default: 0 },
  notes: { type: String },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field on save
SupplierSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
