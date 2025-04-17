// routes/submission.routes.js
import express from 'express';
import {
  submitAssignment,
  getMySubmissions,
  getSubmissionsByAssignment
} from '../../controllers/assigments/submission.controller.js';

const router = express.Router();

router.post('/', submitAssignment); // Student only
router.get('/me', getMySubmissions); // Student
router.get('/assignment/:assignmentId', getSubmissionsByAssignment); // Teacher/Admin

export default router;
