import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);
