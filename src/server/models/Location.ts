
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'USA' },
  phoneNumber: { type: String },
  email: { type: String },
  manager: { type: String },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
