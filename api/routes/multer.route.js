// routes/multer.route.js
import express from 'express';
import { uploadImage, handleImageUpload } from '../controllers/multerImage.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadImage, handleImageUpload);

export default router;