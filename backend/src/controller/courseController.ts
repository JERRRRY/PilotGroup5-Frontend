import { Request, Response } from 'express';
import Course from '../models/Course';
import mongoose from 'mongoose';
import { ICourseCard, ICourseDetail } from '../types/course';
import {
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError,
} from '../utils/errors';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find();

    const courseCards: ICourseCard[] = courses.map((course) => {
      const videoCount = (course.pages || []).filter(
        (page) => page.type === 'video'
      ).length;
      return {
        _id: course._id?.toString() || '',
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Format pages according to mock data structure
    const formattedPages = (course.pages || []).map((page) => {
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
      _id: course._id?.toString(),
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

    const newCourse = new Course({
      title,
      description,
      thumbnail,
      category: category || [],
      keywords: keywords || [],
      published: published || false,
      pages: [],
      resources: [],
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        _id: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        createdAt: newCourse.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new ValidationError(`Validation error: ${messages.join(', ')}`);
    }
    throw new DatabaseError('Failed to create course');
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      throw new NotFoundError('Course not found');
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        _id: updatedCourse._id,
        title: updatedCourse.title,
        updatedAt: updatedCourse.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new ValidationError(`Validation error: ${messages.join(', ')}`);
    }
    throw new DatabaseError('Failed to update course');
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      throw new NotFoundError('Course not found');
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        _id: deletedCourse._id,
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

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (status === 'published') {
      filter.published = true;
    } else if (status === 'draft') {
      filter.published = false;
    }

    const courses = await Course.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    const courseList = courses.map((course) => ({
      _id: course._id,
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, { published }, { new: true });

    if (!updatedCourse) {
      throw new NotFoundError('Course not found');
    }

    res.status(200).json({
      success: true,
      message: published ? 'Course published successfully' : 'Course unpublished successfully',
      data: {
        _id: updatedCourse._id,
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const newPage = {
      ...pageData,
      _id: new mongoose.Types.ObjectId(),
    };

    course.pages?.push(newPage as any);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Page added successfully',
      data: {
        _id: newPage._id,
        order: newPage.order,
        type: newPage.type,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new ValidationError(`Validation error: ${messages.join(', ')}`);
    }
    throw new DatabaseError('Failed to add page to course');
  }
};

export const updateCoursePage = async (req: Request, res: Response): Promise<void> => {
  const { id, pageId } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const pageIndex = course.pages?.findIndex((page) => page._id?.toString() === pageId);

    if (pageIndex === undefined || pageIndex === -1) {
      throw new NotFoundError('Page not found');
    }

    Object.assign(course.pages![pageIndex], updateData);
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      data: {
        _id: pageId,
        order: course.pages![pageIndex].order,
        type: course.pages![pageIndex].type,
        courseId: id,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new ValidationError(`Validation error: ${messages.join(', ')}`);
    }
    throw new DatabaseError('Failed to update page');
  }
};

export const deleteCoursePage = async (req: Request, res: Response): Promise<void> => {
  const { id, pageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const pageIndex = course.pages?.findIndex((page) => page._id?.toString() === pageId);

    if (pageIndex === undefined || pageIndex === -1) {
      throw new NotFoundError('Page not found');
    }

    course.pages?.splice(pageIndex, 1);
    await course.save();

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const newResource = {
      _id: new mongoose.Types.ObjectId(),
      fileName,
      fileUrl,
    };

    course.resources?.push(newResource as any);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: {
        _id: newResource._id,
        fileName,
        fileUrl,
        courseId: id,
        uploadedAt: new Date(),
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid course ID format');
  }

  try {
    const course = await Course.findById(id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const resourceIndex = course.resources?.findIndex((resource) => resource._id?.toString() === resourceId);

    if (resourceIndex === undefined || resourceIndex === -1) {
      throw new NotFoundError('Resource not found');
    }

    course.resources?.splice(resourceIndex, 1);
    await course.save();

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
