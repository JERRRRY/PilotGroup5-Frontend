// components/CourseCard.jsx
import React from "react";

const CourseCard = ({ course }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="relative h-40 rounded-t-xl bg-gradient-to-br">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta */}
        <h3 className="mb-1 text-sm font-semibold text-slate-900">
          {course.title}
        </h3>

        <p className="mb-3 text-xs text-slate-500">{course.description}</p>
      </div>
    </div>
  );
};

export default CourseCard;
