import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/home/CourseCard";
import Header from "../components/common/Header";
import type { Course } from '../types/course';

const CourseEditSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/api/v1/courses");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : data.courses || data.data || []);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <input
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* ADD COURSE */}
          <Link
            to="/course/edit"
            className="rounded-md bg-violet-600 px-4 py-2 text-white"
          >
            Add Course
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className="relative">
              <CourseCard course={course} />

              {/* EDIT BUTTON */}
              <Link
                to={`/course/edit/${course._id}`}
                className="absolute top-2 right-2 rounded bg-white px-2 py-1 text-xs shadow"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseEditSearchPage;
