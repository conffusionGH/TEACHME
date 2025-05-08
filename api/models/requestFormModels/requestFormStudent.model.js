import mongoose from 'mongoose';

const requestFormStudentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    temporaryAddress: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pdf: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Number,
      enum: [0, 1],
      default: 1, // 1 means not deleted, 0 means deleted
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const RequestFormStudent = mongoose.model('RequestFormStudent', requestFormStudentSchema);

export default RequestFormStudent;
