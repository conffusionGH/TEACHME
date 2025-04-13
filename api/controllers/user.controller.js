

import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Helper function to check role hierarchy
const canAccess = (viewerRole, targetRole) => {
  const hierarchy = {
    admin: ['admin', 'manager', 'teacher', 'student'],
    manager: ['manager', 'teacher', 'student'],
    teacher: ['teacher', 'student'],
    student: []
  };
  return hierarchy[viewerRole]?.includes(targetRole);
};

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return next(errorHandler(404, 'User not found!'));

    // Check if current user can modify the target user
    if (req.user.id !== req.params.id &&
      !(req.user.roles === 'admin' ||
        (req.user.roles === 'manager' && targetUser.roles !== 'admin') ||
        (req.user.roles === 'teacher' && targetUser.roles === 'student'))) {
      return next(errorHandler(403, 'Unauthorized to update this user'));
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Prevent role escalation unless admin
    if (req.body.roles && req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Only admins can change roles'));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          ...(req.user.roles === 'admin' && req.body.roles ? { roles: req.body.roles } : {}),
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));

    // Check if current user can view the target user
    if (req.user.id !== req.params.id && !canAccess(req.user.roles, user.roles)) {
      return next(errorHandler(403, 'Unauthorized to view this user'));
    }

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



export const updateUserRole = async (req, res, next) => {
  try {
    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Only admins can update user roles'));
    }

    const validRoles = ['student', 'teacher', 'manager', 'admin'];
    if (!validRoles.includes(req.body.roles)) {
      return next(errorHandler(400, 'Invalid role specified'));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { roles: req.body.roles } },
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------------------------------


export const restoreUser = async (req, res, next) => {
  try {
    // Only admin can restore users
    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to restore users'));
    }

    const restoredUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isDeleted: 1,
        deletedAt: null
      },
      { new: true }
    ).select('-password');

    if (!restoredUser) {
      return next(errorHandler(404, 'User not found in recycle bin'));
    }

    res.status(200).json(restoredUser);
  } catch (error) {
    next(error);
  }
};

export const permanentDeleteUser = async (req, res, next) => {
  try {
    // Only admin can permanently delete
    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to permanently delete users'));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json('User permanently deleted');
  } catch (error) {
    next(error);
  }
};

export const clearRecycleBin = async (req, res, next) => {
  try {
    // Only admin can clear recycle bin
    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to clear recycle bin'));
    }

    await User.deleteMany({ isDeleted: 0 });
    res.status(200).json('Recycle bin cleared successfully');
  } catch (error) {
    next(error);
  }
};

// Modify the existing deleteUser function:
export const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return next(errorHandler(404, 'User not found!'));

    // Check if current user can delete the target user
    if (req.user.id !== req.params.id &&
      !(req.user.roles === 'admin' ||
        (req.user.roles === 'manager' && targetUser.roles !== 'admin') ||
        (req.user.roles === 'teacher' && targetUser.roles === 'student'))) {
      return next(errorHandler(403, 'Unauthorized to delete this user'));
    }

    // Soft delete instead of actual delete
    await User.findByIdAndUpdate(
      req.params.id,
      { 
        isDeleted: 0,
        deletedAt: new Date()
      }
    );

    res.status(200).json('User moved to recycle bin');
  } catch (error) {
    next(error);
  }
};


// Helper function for paginated results
const getPaginatedResults = async (model, query, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  
  const results = await model.find(query)
    .select('-password')
    .skip(startIndex)
    .limit(limit)
    .exec();

  const total = await model.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    results,
    currentPage: page,
    totalPages,
    totalUsers: total
  };
};

// Get all users with pagination
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    let filter = { isDeleted: 1 };

    // Apply role-based filtering
    switch (req.user.roles) {
      case 'admin':
        break;
      case 'manager':
        filter.roles = { $in: ['manager', 'teacher', 'student'] };
        break;
      case 'teacher':
        filter.roles = 'student';
        break;
      case 'student':
        return next(errorHandler(403, 'Unauthorized to view users'));
      default:
        return next(errorHandler(403, 'Unauthorized'));
    }

    const { results, currentPage, totalPages, totalUsers } = await getPaginatedResults(
      User,
      filter,
      page,
      limit
    );

    res.status(200).json({
      users: results,
      currentPage,
      totalPages,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get managers only
export const getManagers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const filter = { isDeleted: 1, roles: 'manager' };

    console.log("Current user role:", req.user.roles); // Add this


    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to view managers'));
    }

    const { results, currentPage, totalPages, totalUsers } = await getPaginatedResults(
      User,
      filter,
      page,
      limit
    );

    res.status(200).json({
      managers: results,
      currentPage,
      totalPages,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get teachers only
export const getTeachers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    let filter = { isDeleted: 1, roles: 'teacher' };

    // Only admin and managers can view teachers
    if (!['admin', 'manager'].includes(req.user.roles)) {
      return next(errorHandler(403, 'Unauthorized to view teachers'));
    }

    const { results, currentPage, totalPages, totalUsers } = await getPaginatedResults(
      User,
      filter,
      page,
      limit
    );

    res.status(200).json({
      teachers: results,
      currentPage,
      totalPages,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get students only
export const getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    let filter = { isDeleted: 1, roles: 'student' };

    // Teachers, managers and admin can view students
    if (!['admin', 'manager', 'teacher'].includes(req.user.roles)) {
      return next(errorHandler(403, 'Unauthorized to view students'));
    }

    const { results, currentPage, totalPages, totalUsers } = await getPaginatedResults(
      User,
      filter,
      page,
      limit
    );

    res.status(200).json({
      students: results,
      currentPage,
      totalPages,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// Get deleted users with pagination
export const getDeletedUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    if (req.user.roles !== 'admin') {
      return next(errorHandler(403, 'Unauthorized to view deleted users'));
    }

    const { results, currentPage, totalPages, totalUsers } = await getPaginatedResults(
      User,
      { isDeleted: 0 },
      page,
      limit
    );

    res.status(200).json({
      deletedUsers: results,
      currentPage,
      totalPages,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};