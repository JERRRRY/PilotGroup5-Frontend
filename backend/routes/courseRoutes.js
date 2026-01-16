import express from 'express';
import {
  getAllCourses,
  getCourseById,
  // createCourse,
  // updateCourse,
  // deleteCourse,
} from '../controller/courseController.js';

const router = express.Router();

// Route to get all courses
router.get('/', getAllCourses);

// // Route to get a specific course by ID
router.get('/:id', getCourseById);

// // Route to create a new course
// router.post('/', createCourse);

// // Route to update an existing course
// router.put('/:id', updateCourse);

// // Route to delete a course
// router.delete('/:id', deleteCourse);

export default router;