
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends mongoose.Document {
  email: string;
  role: 'admin' | 'manager' | 'staff';
  name: string;
  password: string;
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: string;
  updatedBy?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'staff'],
    default: 'staff',
    required: true
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdBy: { type: String },
  updatedBy: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Fix the virtual property
userSchema.virtual('fullName').get(function() {
  return this.name;
});

const User = mongoose.models.User as mongoose.Model<IUser> || 
  mongoose.model<IUser>('User', userSchema);

export default User;
