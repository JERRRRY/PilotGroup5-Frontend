import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import CourseForm from "../components/course/CourseForm";
import {
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/course";
import type { Course } from "../types/course";

const emptyCourse: Course = {
  title: "",
  description: "",
  thumbnail: "",
  pages: [], 
};

const CourseEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course>(emptyCourse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===================== Load ===================== */

  useEffect(() => {
    if (!id) {
      setCourse(emptyCourse);
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(id);
        setCourse(data);
        console.log(data);

      } catch (err) {
        console.error(err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  /* ===================== Handlers ===================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (id) {
        await updateCourse(id, course);
      } else {
        await createCourse(course);
      }

      navigate("/course/edit-search");
    } catch (err) {
      console.error(err);
      setError("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!course._id || !window.confirm(`Delete "${course.title}"?`)) return;

    try {
      setLoading(true);
      await deleteCourse(course._id);
      navigate("/course/edit-search");
    } catch (err) {
      console.error(err);
      setError("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-6">
          {id ? "Edit Course" : "Add New Course"}
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-2 text-red-600">
            {error}
          </div>
        )}

        {/* Course Info */}
        <CourseForm course={course} onChange={handleChange} />

        {/* Pages */}
        {id && (
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pages</h2>

              <Link
                to={`/course/edit/${id}/pages/new`}
                className="rounded bg-violet-600 px-3 py-1 text-white text-sm"
              >
                + Add Page
              </Link>
            </div>

            { (course.pages ?? []).length === 0 && (
              <p className="text-slate-500 text-sm">
                No pages added yet.
              </p>
            )}

            <div className="space-y-2">
              { 
                (course.pages ?? [])
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((page) => (
                  <div
                    key={page._id} 
                    className="flex items-center justify-between border rounded px-3 py-2"
                  >
                    <div>
                      <span className="mr-2 text-sm text-slate-500">
                        {page.order}.
                      </span>
                      <span className="font-medium">{page.title}</span>
                      <span className="ml-2 text-xs text-slate-400 uppercase">
                        {page.type}
                      </span>
                    </div>

                    <Link
                      to={`/course/edit/${id}/pages/${page._id}`}
                      className="text-sm text-violet-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : id ? "Save Course" : "Create Course"}
          </button>

          {id && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="border border-red-500 text-red-600 px-4 py-2 rounded"
            >
              Delete Course
            </button>
          )}

          <button
            onClick={() => navigate("/course/edit-search")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditPage;
