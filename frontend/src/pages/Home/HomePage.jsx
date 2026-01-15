import React from "react";
import CourseCard from "../../components/home/CourseCard";
import { useState, useEffect } from "react";
import Header from "../../components/common/Header";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch("https://mocki.io/v1/a1a06a15-af32-4ed8-ac4a-da66ff69a343");

      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  }  
  fetchCourses();
}, []);

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <Header />
      
      <section className="relative max-w-7xl mx-auto px-4 bg-[#fbf8f1] mt-20 pt-4 ">
        <div className="mb-8 mt-8">
          <h2 className="text-4xl tracking-tight font-semibold text-slate-900">
            Featured Courses
          </h2>
          <p className="text-sm text-slate-500">
            Handpicked courses from top instructors
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
