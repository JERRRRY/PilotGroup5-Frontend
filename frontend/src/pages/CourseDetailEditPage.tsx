import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import { getCourseById, updateCourse } from "../api/course";
import type { Course, Page } from '../types/course';

const emptyPage: Page = {
  order: 1,
  type: "text", // text | video | quiz
  title: "",
  textContent: "",
  videoUrls: [],
  images: [],
  quizData: [],
};

const CourseDetailEditPage = () => {
  const { id: courseId, pageIndex } = useParams<{ id: string; pageIndex?: string }>();
  const navigate = useNavigate();

  const isEditMode = pageIndex !== undefined;

  const [course, setCourse] = useState<Course | null>(null);
  const [page, setPage] = useState<Page>(emptyPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!courseId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getCourseById(courseId);
        setCourse(data);

        if (isEditMode && pageIndex !== undefined && data.pages) {
          setPage(data.pages[Number(pageIndex)]);
        } else {
          setPage({
            ...emptyPage,
            order: data.pages ? data.pages.length + 1 : 1,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId, pageIndex, isEditMode]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPage((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    if (!courseId || !course) return;

    try {
      setLoading(true);
      setError(null);

      const updatedPages = [...(course.pages || [])];

      if (isEditMode && pageIndex !== undefined) {
        updatedPages[Number(pageIndex)] = page;
      } else {
        updatedPages.push(page);
      }

      await updateCourse(courseId, {
        ...course,
        pages: updatedPages,
      });

      navigate(`/course/edit/${courseId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save page");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!courseId || !course || pageIndex === undefined || !window.confirm(`Delete page "${page.title}"?`)) return;

    try {
      setLoading(true);

      const updatedPages = (course.pages || []).filter(
        (_, index) => index !== Number(pageIndex)
      );

      await updateCourse(courseId, {
        ...course,
        pages: updatedPages,
      });

      navigate(`/course/edit/${courseId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete page");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-6">
          {isEditMode ? "Edit Page" : "Add New Page"}
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-4 py-2 text-red-600">
            {error}
          </div>
        )}

        {/* Page Form */}
        <div className="space-y-4">
          <input
            name="title"
            value={page.title}
            onChange={handleChange}
            placeholder="Page title"
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="type"
            value={page.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="quiz">Quiz</option>
          </select>

          {/* TEXT */}
          {page.type === "text" && (
            <textarea
              name="textContent"
              value={page.textContent || ""}
              onChange={handleChange}
              rows={5}
              placeholder="Text content"
              className="w-full border rounded px-3 py-2"
            />
          )}

          {/* VIDEO */}
          {page.type === "video" && (
            <input
              value={page.videoUrls?.[0] || ""}
              onChange={(e) =>
                setPage({
                  ...page,
                  videoUrls: [e.target.value],
                })
              }
              placeholder="YouTube video URL"
              className="w-full border rounded px-3 py-2"
            />
          )}

          {/* QUIZ (placeholder) */}
          {page.type === "quiz" && (
            <div className="text-sm text-slate-500">
              Quiz editor coming soon!
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Page"}
          </button>

          {isEditMode && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50"
            >
              Delete Page
            </button>
          )}

          <button
            onClick={() => navigate(`/course/edit/${courseId}`)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailEditPage;
