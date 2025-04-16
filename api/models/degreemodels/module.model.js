import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  semester: { 
    type: Number,
    required: true 
  },
  subjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subject' 
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Module', moduleSchema);