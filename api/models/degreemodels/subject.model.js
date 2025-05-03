import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String,
    unique: true,
    required: true 
  },
  description: { 
    type: String 
  },
  image: {
    type: String,
    default: "https://play-lh.googleusercontent.com/2kD49Sc5652DmjJNf7Kh17DEXx9HiD2Zz3LsNc6929yTW6VBbGBCr-CQLoOA7iUf6hk"
  },
  video: {
    type: String // URL to the uploaded video
  },
  creditHours: {
    type: Number,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Number,
    enum: [0, 1],
    default: 1, // 1 means not deleted, 0 means deleted
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add text index for searching
subjectSchema.index({
  name: 'text',
  code: 'text',
  description: 'text'
});

export default mongoose.model('Subject', subjectSchema);