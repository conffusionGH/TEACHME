import express from 'express';
import {
  createRequestForm,
  getAllRequestForms,
  getRequestForm,
  updateRequestForm,
  deleteRequestForm,
  restoreRequestForm,
  restoreAllRequestForms,
  permanentDeleteRequestForm,
  deleteAllPermanently,
  getDeletedRequestForms,
} from '../../controllers/requestFormController/requestFormStudent.controller.js';
import { uploadImage } from '../../controllers/multerImage.controller.js';
import { uploadPDF } from '../../controllers/multerwork/multerPDF.controller.js';


const router = express.Router();

// CRUD routes with file uploads
router.get('/', getAllRequestForms);
router.get('/bin/deleted',  getDeletedRequestForms);

router.post('/', uploadImage, uploadPDF, createRequestForm);
router.get('/:id', getRequestForm);
router.put('/update/:id', uploadImage, uploadPDF, updateRequestForm);
router.delete('/delete/:id', deleteRequestForm);

// Recycle bin routes
router.put('/bin/restore/:id', restoreRequestForm);
router.put('/bin/restore-all', restoreAllRequestForms);
router.delete('/bin/permanent/:id', permanentDeleteRequestForm);
router.delete('/bin/clear', deleteAllPermanently);

export default router;