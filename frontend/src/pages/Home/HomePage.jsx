import React from "react";
import CourseCard from "../../components/home/CourseCard";
import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import CourseSection from "../../components/home/CourseSection";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/v1/courses");

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(Array.isArray(data) ? data : data.courses || data.data || []);
    } catch (error) {
      console.error(error);
    }
  }  
  fetchCourses();
}, []);

  const categories = [...new Set(courses.flatMap((course) => course.category))];
  console.log("Categories:", categories);

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
      <Header />
      {categories.map((category) => (
        <CourseSection key={category} category={category} courses={courses} />
      ))}
    </div>
  );
};

export default HomePage;
