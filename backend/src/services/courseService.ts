import { v4 as uuidv4 } from 'uuid';
import {
  getCourseById,
  getAllCourses,
  getCoursesByPublished,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../utils/dynamodb';
import { ICourse } from '../types/course';

// Service layer for Course operations with DynamoDB
export class CourseService {
  /**
   * Get all courses
   */
  static async getAllCourses() {
    try {
      const result = await getAllCourses();
      return result.Items || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get course by ID
   */
  static async getCourseById(courseId: string) {
    try {
      const result = await getCourseById(courseId);
      return result.Item || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new course
   */
  static async createCourse(courseData: Omit<ICourse, 'courseId' | 'createdAt' | 'updatedAt'>) {
    try {
      const courseId = uuidv4();
      const now = Math.floor(Date.now() / 1000); // Unix timestamp

      const newCourse = {
        courseId,
        ...courseData,
        pages: courseData.pages || [],
        resources: courseData.resources || [],
        published: courseData.published ? 'true' : 'false', // Convert to string for DynamoDB GSI
        createdAt: now,
        updatedAt: now,
      };

      await createCourse(newCourse);
      return newCourse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update course
   */
  static async updateCourse(courseId: string, updateData: Partial<ICourse>) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const dataToUpdate = {
        ...updateData,
        updatedAt: now,
      };

      const result = await updateCourse(courseId, dataToUpdate);
      return result.Attributes || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete course
   */
  static async deleteCourse(courseId: string) {
    try {
      await deleteCourse(courseId);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get courses by status (published or draft)
   */
  static async getCoursesByStatus(published: boolean, limit?: number) {
    try {
      const result = await getCoursesByPublished(published ? 'true' : 'false', limit);
      return result.Items || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add page to course
   */
  static async addPageToCourse(courseId: string, pageData: any) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const newPage = {
        ...pageData,
        pageId: uuidv4(),
      };

      const pages = course.pages || [];
      pages.push(newPage);

      await updateCourse(courseId, { pages, updatedAt: Math.floor(Date.now() / 1000) });
      return newPage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update page in course
   */
  static async updateCoursePage(courseId: string, pageId: string, updateData: any) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const pages = course.pages || [];
      const pageIndex = pages.findIndex((p: any) => p.pageId === pageId);

      if (pageIndex === -1) {
        throw new Error('Page not found');
      }

      pages[pageIndex] = { ...pages[pageIndex], ...updateData };

      await updateCourse(courseId, { pages, updatedAt: Math.floor(Date.now() / 1000) });
      return pages[pageIndex];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete page from course
   */
  static async deleteCoursePage(courseId: string, pageId: string) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const pages = (course.pages || []).filter((p: any) => p.pageId !== pageId);

      await updateCourse(courseId, { pages, updatedAt: Math.floor(Date.now() / 1000) });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add resource to course
   */
  static async addResource(courseId: string, resourceData: any) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const newResource = {
        ...resourceData,
        resourceId: uuidv4(),
        uploadedAt: Math.floor(Date.now() / 1000),
      };

      const resources = course.resources || [];
      resources.push(newResource);

      await updateCourse(courseId, { resources, updatedAt: Math.floor(Date.now() / 1000) });
      return newResource;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete resource from course
   */
  static async deleteResource(courseId: string, resourceId: string) {
    try {
      const course = await this.getCourseById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const resources = (course.resources || []).filter((r: any) => r.resourceId !== resourceId);

      await updateCourse(courseId, { resources, updatedAt: Math.floor(Date.now() / 1000) });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
