
import Subject from '../../models/degreemodels/subject.model.js';
import { errorHandler } from '../../utils/error.js';
import { deleteImageFile, getLocalImageFilePath } from '../../utils/deleteImage.js';

// Helper function for paginated results
const getPaginatedSubjects = async (query, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;

  const results = await Subject.find(query)
    .skip(startIndex)
    .limit(limit)
    .exec();

  const total = await Subject.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    results,
    currentPage: page,
    totalPages,
    totalSubjects: total
  };
};

export const createSubject = async (req, res, next) => {
  try {
    const { name, code, description, creditHours, isActive } = req.body;

    let imageUrl = "https://play-lh.googleusercontent.com/2kD49Sc5652DmjJNf7Kh17DEXx9HiD2Zz3LsNc6929yTW6VBbGBCr-CQLoOA7iUf6hk";
    // if (req.files && req.files.image) {
    //   imageUrl = `${process.env.SERVER_DOMAIN || 'http://localhost:8000'}/api/assets/images/${req.files.image[0].filename}`;
    // }
    if (req.body.image) {
      imageUrl = req.body.image.startsWith('http')
        ? req.body.image
        : `${process.env.SERVER_DOMAIN || 'http://localhost:8000'}${req.body.image}`;
    }

    let videoUrl = null;
    if (req.body.video) {
      videoUrl = req.body.video.startsWith('http')
        ? req.body.video
        : `${process.env.SERVER_DOMAIN || 'http://localhost:8000'}${req.body.video}`;
    }


    const newSubject = new Subject({
      name,
      code,
      description,
      image: imageUrl,
      video: videoUrl,
      creditHours: Number(creditHours),
      isActive: isActive === 'true' || isActive === true
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return next(errorHandler(404, 'Subject not found'));

    const { name, code, description, creditHours, isActive } = req.body;

    const updateData = {
      name: name || subject.name,
      code: code || subject.code,
      description: description || subject.description,
      creditHours: Number(creditHours) || subject.creditHours,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : subject.isActive,
      image: subject.image,
      video: subject.video
    };

    const serverDomain = process.env.SERVER_DOMAIN || 'http://localhost:8000';

    if (req.files && req.files.image) {
      if (subject.image && !subject.image.includes('default')) {
        try {
          const imagePath = getLocalImageFilePath(subject.image);
          await deleteImageFile(imagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      updateData.image = `${serverDomain}/api/assets/images/${req.files.image[0].filename}`;
    }

    if (req.files && req.files.video) {
      if (subject.video) {
        try {
          const videoPath = getLocalImageFilePath(subject.video);
          await deleteImageFile(videoPath);
        } catch (err) {
          console.error('Error deleting old video:', err);
        }
      }
      updateData.video = `${serverDomain}/api/assets/videos/${req.files.video[0].filename}`;
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(updatedSubject);
  } catch (error) {
    next(error);
  }
};

export const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(errorHandler(404, 'Subject not found'));
    }

    res.status(200).json(subject);
  } catch (error) {
    next(error);
  }
};

export const searchSubjects = async (req, res, next) => {
  try {
    const searchTerm = req.query.term || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { code: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const { results, currentPage, totalPages, totalSubjects } = await getPaginatedSubjects(
      query,
      page,
      limit
    );

    res.status(200).json({
      subjects: results,
      currentPage,
      totalPages,
      totalSubjects
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const showDeleted = req.query.showDeleted === 'true';

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };

    if (!showDeleted) {
      query.isDeleted = 1;
    }

    const { results, currentPage, totalPages, totalSubjects } = await getPaginatedSubjects(
      query,
      page,
      limit
    );

    res.status(200).json({
      subjects: results,
      currentPage,
      totalPages,
      totalSubjects
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(errorHandler(404, 'Subject not found'));
    }

    await Subject.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: 0,
        deletedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({ message: 'Subject moved to recycle bin' });
  } catch (error) {
    next(error);
  }
};

export const restoreSubject = async (req, res, next) => {
  try {
    const restoredSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: 1,
        deletedAt: null
      },
      { new: true }
    );

    if (!restoredSubject) {
      return next(errorHandler(404, 'Subject not found in recycle bin'));
    }

    res.status(200).json(restoredSubject);
  } catch (error) {
    next(error);
  }
};

export const permanentDeleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return next(errorHandler(404, 'Subject not found'));
    }

    if (subject.image && !subject.image.includes('default')) {
      try {
        const imagePath = getLocalImageFilePath(subject.image);
        await deleteImageFile(imagePath);
      } catch (err) {
        console.error('Error deleting subject image:', err);
      }
    }

    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subject permanently deleted' });
  } catch (error) {
    next(error);
  }
};

export const clearSubjectRecycleBin = async (req, res, next) => {
  try {
    const deletedSubjects = await Subject.find({ isDeleted: 0 });
    const deletionPromises = deletedSubjects.map(async (subject) => {
      if (subject.image && !subject.image.includes('default')) {
        try {
          const imagePath = getLocalImageFilePath(subject.image);
          await deleteImageFile(imagePath);
        } catch (err) {
          console.error(`Image deletion failed for subject ${subject._id}:`, err);
        }
      }
    });

    await Promise.all(deletionPromises);
    await Subject.deleteMany({ isDeleted: 0 });

    res.status(200).json({ message: 'Recycle bin cleared (subjects + images deleted)' });
  } catch (error) {
    next(error);
  }
};

export const getDeletedSubjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { results, currentPage, totalPages, totalSubjects } = await getPaginatedSubjects(
      { isDeleted: 0 },
      page,
      limit
    );

    res.status(200).json({
      deletedSubjects: results,
      currentPage,
      totalPages,
      totalSubjects
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubjectsWithoutPagination = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ isDeleted: 1 });

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};
