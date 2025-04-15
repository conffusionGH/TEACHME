import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' },
  amountPaid: { type: Number, required: true },
  paidOn: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
