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
        const { name, code, description, image, creditHours, isActive } = req.body;


        let imageUrl;

        if (req.file) {
            // Case 1: File uploaded
            imageUrl = `${process.env.SERVER_DOMAIN || 'http://localhost:8000'}/api/assets/images/${req.file.filename}`;
        } else if (image) {
            // Case 2: URL provided in body
            imageUrl = image;
        } else {
            // Case 3: Use default
            imageUrl = "https://play-lh.googleusercontent.com/2kD49Sc5652DmjJNf7Kh17DEXx9HiD2Zz3LsNc6929yTW6VBbGBCr-CQLoOA7iUf6hk";
        }

        const newSubject = new Subject({
            name,
            code,
            description,
            image: imageUrl,
            creditHours: Number(creditHours),
            isActive: isActive === 'true'
        });

        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (error) {
        next(error);
    }
};


// Get a single subject by ID
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






export const updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) return next(errorHandler(404, 'Subject not found'));

        const {
            name,
            code,
            description,
            creditHours,
            isActive,
            image: imageFromBody
        } = req.body;

        const updateData = {
            name,
            code,
            description,
            creditHours: Number(creditHours),
            isActive: isActive === 'true' || isActive === true,
            image: subject.image // default fallback
        };

        const serverDomain = process.env.SERVER_DOMAIN || 'http://localhost:8000';

        // ✅ Priority 1: If new image uploaded via Multer
        if (req.file) {
            // delete old image if not default
            if (subject.image && !subject.image.includes('default')) {
                try {
                    const imagePath = getLocalImageFilePath(subject.image);
                    await deleteImageFile(imagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            updateData.image = `${serverDomain}/api/assets/images/${req.file.filename}`;
        }
        // ✅ Priority 2: If image is provided in the request body
        else if (imageFromBody) {
            // Convert to full URL if it's a relative path
            if (imageFromBody.startsWith('/api/assets/images/')) {
                updateData.image = `${serverDomain}${imageFromBody}`;
            }
            // Keep as is if it's already a full URL or default image
            else {
                updateData.image = imageFromBody;
            }
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


// Modify getAllSubjects to exclude deleted subjects by default
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

        // Only show non-deleted subjects unless explicitly requested
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

// Soft delete a subject
export const deleteSubject = async (req, res, next) => {
    try {
        // if (!['admin', 'manager'].includes(req.user.roles)) {
        //     return next(errorHandler(403, 'Unauthorized to delete subjects'));
        // }

        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return next(errorHandler(404, 'Subject not found'));
        }

        // Soft delete
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

// Restore a subject
export const restoreSubject = async (req, res, next) => {
    try {
        // if (!['admin', 'manager'].includes(req.user.roles)) {
        //     return next(errorHandler(403, 'Unauthorized to restore subjects'));
        // }

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

// Permanently delete a subject
export const permanentDeleteSubject = async (req, res, next) => {
    try {
        // if (!['admin', 'manager'].includes(req.user.roles)) {
        //     return next(errorHandler(403, 'Unauthorized to permanently delete subjects'));
        // }

        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return next(errorHandler(404, 'Subject not found'));
        }

        // Delete associated image if it exists
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

// Clear all deleted subjects
export const clearSubjectRecycleBin = async (req, res, next) => {
    try {
        // if (!['admin', 'manager'].includes(req.user.roles)) {
        //     return next(errorHandler(403, 'Unauthorized to clear recycle bin'));
        // }

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

// Get deleted subjects
export const getDeletedSubjects = async (req, res, next) => {
    try {
        // if (!['admin', 'manager'].includes(req.user.roles)) {
        //     return next(errorHandler(403, 'Unauthorized to view deleted subjects'));
        // }

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