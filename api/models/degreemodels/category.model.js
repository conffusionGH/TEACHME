import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., BIT Computing Hons
  durationInYears: { type: Number, required: true },
  years: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Year' }]
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
