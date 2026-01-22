import { Request, Response } from 'express';
// import Course from '../models/Course'; // MongoDB - commented out
// import mongoose from 'mongoose'; // MongoDB - commented out
import { CourseService } from '../services/courseService'; // DynamoDB service
import { ICourseCard, ICourseDetail } from '../types/course';
import {
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError,
} from '../utils/errors';

// Validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await CourseService.getAllCourses();

    const courseCards: ICourseCard[] = courses.map((course: any) => {
      const videoCount = (course.pages || []).filter(
        (page: any) => page.type === 'video'
      ).length;
      return {
        _id: course.courseId,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        keywords: course.keywords,
        videoCount: videoCount,
      };
    });
    res.status(200).json({ success: true, data: courseCards });
  } catch (error) {
    throw new DatabaseError('Failed to fetch courses');
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await CourseService.getCourseById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Format pages according to mock data structure
    const formattedPages = (course.pages || []).map((page: any) => {
      return {
        order: page.order,
        type: page.type,
        title: page.title,
        textContent: page.textContent,
        videoUrls: page.videoUrls,
        images: page.images,
        quizData: page.quizData,
      };
    });

    const courseDetail: ICourseDetail = {
      _id: course.courseId,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      keywords: course.keywords,
      published: course.published,
      pages: formattedPages,
    };

    res.status(200).json({ success: true, data: courseDetail });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to fetch course details');
  }
};

// CMS Operations

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, thumbnail, category, keywords, published } = req.body;

    // Validation
    if (!title || !description || !thumbnail) {
      throw new ValidationError('Missing required fields: title, description, thumbnail');
    }

    const newCourse = await CourseService.createCourse({
      title,
      description,
      thumbnail,
      category: category || [],
      keywords: keywords || [],
      published: published || false,
      pages: [],
      resources: [],
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        _id: newCourse.courseId,
        title: newCourse.title,
        description: newCourse.description,
        createdAt: newCourse.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to create course');
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const updatedCourse = await CourseService.updateCourse(id, req.body);

    if (!updatedCourse) {
      throw new NotFoundError('Course not found');
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        _id: updatedCourse.courseId,
        title: updatedCourse.title,
        updatedAt: updatedCourse.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to update course');
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await CourseService.getCourseById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await CourseService.deleteCourse(id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        _id: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to delete course');
  }
};

export const getAllCoursesForCMS = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    if (page < 1 || limit < 1) {
      throw new ValidationError('Page and limit must be positive numbers');
    }

    // Get courses by status
    let courses: any[] = [];
    if (status === 'published') {
      courses = await CourseService.getCoursesByStatus(true);
    } else if (status === 'draft') {
      courses = await CourseService.getCoursesByStatus(false);
    } else {
      courses = await CourseService.getAllCourses();
    }

    // Sort by createdAt descending
    courses.sort((a: any, b: any) => b.createdAt - a.createdAt);

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedCourses = courses.slice(skip, skip + limit);
    const total = courses.length;

    const courseList = paginatedCourses.map((course: any) => ({
      _id: course.courseId,
      title: course.title,
      status: course.published ? 'published' : 'draft',
      pagesCount: course.pages?.length || 0,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courseList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
        limit,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to fetch courses for CMS');
  }
};

export const publishCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { published } = req.body;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const updatedCourse = await CourseService.updateCourse(id, { published });

    if (!updatedCourse) {
      throw new NotFoundError('Course not found');
    }

    res.status(200).json({
      success: true,
      message: published ? 'Course published successfully' : 'Course unpublished successfully',
      data: {
        _id: updatedCourse.courseId,
        title: updatedCourse.title,
        published: updatedCourse.published,
        publishedAt: new Date(),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to publish course');
  }
};

export const addPageToCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const pageData = req.body;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const newPage = await CourseService.addPageToCourse(id, pageData);

    res.status(201).json({
      success: true,
      message: 'Page added successfully',
      data: {
        _id: newPage.pageId,
        order: newPage.order,
        type: newPage.type,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to add page to course');
  }
};

export const updateCoursePage = async (req: Request, res: Response): Promise<void> => {
  const { id, pageId } = req.params;
  const updateData = req.body;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const updatedPage = await CourseService.updateCoursePage(id, pageId, updateData);

    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      data: {
        _id: pageId,
        order: updatedPage.order,
        type: updatedPage.type,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to update page');
  }
};

export const deleteCoursePage = async (req: Request, res: Response): Promise<void> => {
  const { id, pageId } = req.params;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    await CourseService.deleteCoursePage(id, pageId);

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully',
      data: {
        pageId,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to delete page');
  }
};

export const uploadResource = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fileName, fileUrl } = req.body;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const newResource = await CourseService.addResource(id, {
      fileName,
      fileUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: {
        _id: newResource.resourceId,
        fileName,
        fileUrl,
        courseId: id,
        uploadedAt: newResource.uploadedAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to upload resource');
  }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  const { id, resourceId } = req.params;

  if (!isValidUUID(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    await CourseService.deleteResource(id, resourceId);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
      data: {
        resourceId,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to delete resource');
  }
};
