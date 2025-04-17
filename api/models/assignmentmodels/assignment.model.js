import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  deadline: {
    type: Date,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  educator: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  pdf: {
    type: String, // URL to the uploaded PDF
  },
  
}, { timestamps: true });


// Indexes for faster queries
assignmentSchema.index({ subject: 1, isDeleted: 1 });
assignmentSchema.index({ deadline: 1 });

export default mongoose.model('Assignment', assignmentSchema);
