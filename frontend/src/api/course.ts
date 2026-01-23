import type { Course } from '../types/course';

const BASE_URL = "/api/v1/courses";

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return data.data || data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  return data.data || data;
};

export const createCourse = async (course: Course): Promise<Response> => {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
};

export const updateCourse = async (id: string, course: Course): Promise<Response> => {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
};

export const deleteCourse = async (id: string): Promise<Response> => {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
};
