import mongoose from 'mongoose';

// Sub-documents for the ledger entries shown on a crop
const expenseSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String }, // ISO date string (YYYY-MM-DD) to match the frontend
  },
  { timestamps: true }
);

const saleSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String },
  },
  { timestamps: true }
);

const cropSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    status: { type: String, default: 'Active' },
    currentStage: { type: String, default: 'Seed prep' },
    areaPercent: { type: Number, default: 0 },
    plantingDate: { type: String },
    harvestingDate: { type: String },
    field: { type: String, default: '' },
    notes: { type: String, default: '' },
    aiSuggestion: { type: String, default: '' },
    expenses: [expenseSchema],
    sales: [saleSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);
