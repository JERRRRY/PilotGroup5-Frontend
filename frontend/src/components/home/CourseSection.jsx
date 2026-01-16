import React from "react";
import CourseCard from "./CourseCard";

const CourseSection = ({ category, courses }) => {
  const categoryCourses = courses.filter(
    (course) => course.category.includes(category)
  );

   console.log(`${category} courses:`, categoryCourses.length);

  if (categoryCourses.length === 0) return null;

  return (
    <section className="relative max-w-7xl mx-auto px-4 bg-[#fbf8f1] mt-20 py-4">
      <div className="mb-8">
        <h2 className="text-4xl font-semibold text-slate-900">
          {category} Courses
        </h2>
        <p className="text-sm text-slate-500">
          Handpicked {category} courses from top instructors
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CourseSection;