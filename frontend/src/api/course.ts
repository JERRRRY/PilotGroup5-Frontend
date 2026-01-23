import type { Course, Page } from "../types/course";

const BASE_URL = "/api/v1/courses";


const jsonHeaders = {
  "Content-Type": "application/json",
};

async function parseJSON<T>(res: Response): Promise<T> {
  const data = await res.json();
  return data.data ?? data;
}


export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(BASE_URL);
  return parseJSON<Course[]>(res);
};

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return parseJSON<Course>(res);
};

export const createCourse = async (course: Course): Promise<Course> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(course),
  });

  return parseJSON<Course>(res);
};

export const updateCourse = async (
  id: string,
  course: Course
): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(course),
  });

  return parseJSON<Course>(res);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};


export const addPageToCourse = async (
  courseId: string,
  page: Omit<Page, "_id">
): Promise<Page> => {
  const res = await fetch(`${BASE_URL}/${courseId}/pages`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(page),
  });

  return parseJSON<Page>(res);
};

export const updateCoursePage = async (
  courseId: string,
  pageId: string,
  page: Page
): Promise<Page> => {
  const res = await fetch(
    `${BASE_URL}/${courseId}/pages/${pageId}`,
    {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(page),
    }
  );

  return parseJSON<Page>(res);
};

export const deleteCoursePage = async (
  courseId: string,
  pageId: string
): Promise<void> => {
  await fetch(
    `${BASE_URL}/${courseId}/pages/${pageId}`,
    {
      method: "DELETE",
    }
  );
};
