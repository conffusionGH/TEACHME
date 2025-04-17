import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'late'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexes for performance
submissionSchema.index({ assignment: 1, student: 1 }); // Unique submission per student
submissionSchema.index({ status: 1 });

export default mongoose.model('Submission', submissionSchema);
