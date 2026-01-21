import express, { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesForCMS,
  publishCourse,
  addPageToCourse,
  updateCoursePage,
  deleteCoursePage,
  uploadResource,
  deleteResource,
} from '../controller/courseController.js';
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateAddPage,
  validateUploadResource,
  validatePublishCourse,
} from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router: Router = express.Router();

// Public routes (for students)
router.get('/', asyncHandler(getAllCourses));
router.get('/:id', asyncHandler(getCourseById));

// CMS routes (for teachers/admins)
router.post('/', validateCreateCourse, asyncHandler(createCourse));
router.put('/:id', validateUpdateCourse, asyncHandler(updateCourse));
router.delete('/:id', asyncHandler(deleteCourse));

// CMS dashboard
router.get('/cms/dashboard', asyncHandler(getAllCoursesForCMS));

// Course publishing
router.put('/:id/publish', validatePublishCourse, asyncHandler(publishCourse));

// Page management
router.post('/:id/pages', validateAddPage, asyncHandler(addPageToCourse));
router.put('/:id/pages/:pageId', asyncHandler(updateCoursePage));
router.delete('/:id/pages/:pageId', asyncHandler(deleteCoursePage));

// Resource management
router.post('/:id/resources', validateUploadResource, asyncHandler(uploadResource));
router.delete('/:id/resources/:resourceId', asyncHandler(deleteResource));

export default router;
