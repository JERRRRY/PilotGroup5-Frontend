import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import CourseForm from "../components/course/CourseForm";
import {
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/course";

const emptyCourse = {
  title: "",
  description: "",
  thumbnail: "",
};

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(emptyCourse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error(err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  //handle user input change
  const handleChange = (e) => {
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
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      setLoading(true);
      await deleteCourse(id);
      navigate("/course/edit-search");
    } catch (err) {
      console.error(err);
      setError("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">
            {id ? "Edit Course" : "Add New Course"}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-2 text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <CourseForm course={course} onChange={handleChange} />

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : id ? "Save Changes" : "Create Course"}
          </button>
          {id && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50 disabled:opacity-50"
            >
              Delete
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
