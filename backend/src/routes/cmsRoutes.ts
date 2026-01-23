import express, { Router } from 'express';
import { getAllCoursesForCMS } from '../controller/courseController';
import { asyncHandler } from '../middleware/errorMiddleware';

const router: Router = express.Router();

// CMS dashboard - GET /api/v1/cms/courses
// This matches the MainDesign.md specification
router.get('/courses', asyncHandler(getAllCoursesForCMS));

export default router;
