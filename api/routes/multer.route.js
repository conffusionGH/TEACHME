// routes/multer.route.js
import express from 'express';
import { uploadImage, handleImageUpload } from '../controllers/multerImage.controller.js';
import { uploadPDF, handlePDFUpload } from '../controllers/mutlerwork/multerPDF.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/upload', verifyToken, uploadImage, handleImageUpload);
router.post('/upload-pdf', verifyToken, uploadPDF, handlePDFUpload);

export default router;