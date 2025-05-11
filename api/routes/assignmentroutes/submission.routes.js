// routes/submission.routes.js
import express from 'express';
import {
  submitAssignment,
  getMySubmissions,
  getSubmissionsByAssignment
} from '../../controllers/assigments/submission.controller.js';
import {verifyToken} from '../../utils/verifyUser.js';

const router = express.Router();

router.post('/',verifyToken, submitAssignment); // Student only
router.get('/me',verifyToken, getMySubmissions); // Student
router.get('/assignment/:assignmentId',verifyToken,  getSubmissionsByAssignment); // Teacher/Admin

export default router;
