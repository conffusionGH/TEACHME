import mongoose from 'mongoose';

const yearSchema = new mongoose.Schema({
  yearNumber: { type: Number, required: true },
  fee: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
}, { timestamps: true });

export default mongoose.model('Year', yearSchema);
