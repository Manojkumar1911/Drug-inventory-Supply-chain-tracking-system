
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: any;
  category: string;
  description?: string;
  is_system?: boolean;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: { type: String, required: true, default: 'general' },
    description: { type: String },
    is_system: { type: Boolean, default: false },
    updated_by: { type: String }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Settings: Model<ISettings> = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;
