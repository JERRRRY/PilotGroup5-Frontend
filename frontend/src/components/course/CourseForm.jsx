import React from 'react'

const CourseForm = ({ course, onChange }) => {
  return (
    <div className="space-y-4">
      <input
        name="title"
        value={course.title}
        onChange={onChange}
        placeholder="Course title"
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="description"
        value={course.description}
        onChange={onChange}
        placeholder="Description"
        className="w-full border rounded px-3 py-2"
      />

      <input
        name="thumbnail"
        value={course.thumbnail}
        onChange={onChange}
        placeholder="Thumbnail URL"
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
};

export default CourseForm