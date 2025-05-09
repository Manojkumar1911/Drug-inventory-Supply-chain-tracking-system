
import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  category: string;
  description?: string;
  is_system: boolean;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

const SettingsSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: { type: String, required: true, default: 'general' },
  description: { type: String },
  is_system: { type: Boolean, default: false },
  updated_by: { type: String, default: 'system' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field on save
SettingsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);
