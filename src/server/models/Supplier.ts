
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contact_person: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  lead_time?: number;
  minimum_order_amount?: number;
  notes?: string;
  is_active?: boolean;
  rating?: number;
  created_at?: Date;
  updated_at?: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    contact_person: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
    country: { type: String, default: 'USA' },
    tax_id: { type: String },
    payment_terms: { type: String },
    lead_time: { type: Number },
    minimum_order_amount: { type: Number },
    notes: { type: String },
    is_active: { type: Boolean, default: true },
    rating: { type: Number, default: 3, min: 1, max: 5 }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Supplier: Model<ISupplier> = mongoose.model<ISupplier>('Supplier', supplierSchema);

export default Supplier;
