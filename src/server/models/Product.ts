
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  expiry_date?: Date;
  reorder_level: number;
  manufacturer?: string;
  created_at?: Date;
  updated_at?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    location: { type: String, required: true },
    expiry_date: { type: Date },
    reorder_level: { type: Number, required: true, default: 5 },
    manufacturer: { type: String }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
