import express from 'express';

//upload handler
import { uploadImage, handleImageUpload } from '../controllers/multerImage.controller.js';
import { uploadPDF, handlePDFUpload } from '../controllers/mutlerwork/multerPDF.controller.js';
import { handleVideoUpload, uploadVideo } from '../controllers/mutlerwork/multerVideo.controller.js';

import {  } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/upload',  uploadImage, handleImageUpload);
router.post('/upload-pdf',  uploadPDF, handlePDFUpload);
router.post('/upload-video',  uploadVideo, handleVideoUpload);

// verifyToken

export default router;