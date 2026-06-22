import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Embedded farmer profile — mirrors farmerProfile in the frontend AppContext
const farmerProfileSchema = new mongoose.Schema(
  {
    totalArea: { type: Number, default: 0 },
    areaUnit: { type: String, default: 'acre' },
    location: { type: String, default: '' },
    soilType: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
    avatar: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    farmerProfile: { type: farmerProfileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Hash the password before saving when it has changed
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plain password against the stored hash
userSchema.methods.matchPassword = function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
