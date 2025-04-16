import express from 'express';
import { 
  createSubject, 
  getAllSubjects, 
  getSubject, 
  updateSubject, 
  deleteSubject, 
  searchSubjects,
  restoreSubject,
  permanentDeleteSubject,
  clearSubjectRecycleBin,
  getDeletedSubjects
} from '../../controllers/subjects/subjects.controller.js';
import { uploadImage } from '../../controllers/multerImage.controller.js';

const router = express.Router();

// router.post('/', uploadImage, handleImageUpload, createSubject);
router.post('/', uploadImage, createSubject); 
router.get('/', getAllSubjects);
router.get('/delete', getDeletedSubjects);
router.get('/search', searchSubjects);
router.get('/:id', getSubject);
router.put('/:id', uploadImage, updateSubject);
router.delete('/:id', deleteSubject);
router.post('/restore/:id', restoreSubject);
router.delete('/permanent/:id', permanentDeleteSubject);
router.delete('/recycle-bin/clear', clearSubjectRecycleBin);

export default router;