import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit: { type: String, default: '/kg' },
    description: { type: String, default: '' },
    freshness: { type: Number, default: 100 },
    location: { type: String, default: '' },
    farmer: { type: String, default: '' }, // display name, denormalized for marketplace cards
    image: { type: String, default: null },
    organic: { type: Boolean, default: false },
    category: { type: String, default: 'Vegetables' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
