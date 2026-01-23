import type { Course, Page } from "../types/course";

const BASE_URL = "/api/v1/courses";


const jsonHeaders = {
  "Content-Type": "application/json",
};

async function parseJSON<T>(res: Response): Promise<T> {
  const text = await res.text(); 

  console.log("⬇️ RESPONSE STATUS:", res.status);
  console.log("⬇️ RESPONSE OK:", res.ok);
  console.log("⬇️ RESPONSE TEXT:", text);

  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;

    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }

    throw new Error(errorMessage);
  }

  if (!text) {
    return null as T;
  }

  const data = JSON.parse(text);
  return data.data ?? data;
}



export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(BASE_URL);
  return parseJSON<Course[]>(res);
};

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await parseJSON<Course>(res);
  // Validate that we got a valid course object with required fields
  if (!data || typeof data !== 'object' || !data.title || !data.description || !data.thumbnail) {
    throw new Error(`Invalid course data received for id: ${id}. Missing required fields.`);
  }
  return data;
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
