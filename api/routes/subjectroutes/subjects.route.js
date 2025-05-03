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
  getDeletedSubjects,
  getAllSubjectsWithoutPagination
} from '../../controllers/subjects/subjects.controller.js';
import { uploadImage } from '../../controllers/multerImage.controller.js';
import {uploadVideo} from '../../controllers/mutlerwork/multerVideo.controller.js';

const router = express.Router();

router.post('/', uploadImage, uploadVideo, createSubject);
router.get('/all', getAllSubjectsWithoutPagination);
router.get('/', getAllSubjects);
router.get('/delete', getDeletedSubjects);
router.get('/search', searchSubjects);
router.get('/:id', getSubject);
router.put('/:id',uploadImage, uploadVideo , updateSubject);
router.delete('/:id', deleteSubject);
router.post('/restore/:id', restoreSubject);
router.delete('/permanent/:id', permanentDeleteSubject);
router.delete('/recycle-bin/clear', clearSubjectRecycleBin);

export default router;