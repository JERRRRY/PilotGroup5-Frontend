import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import {
  getCourseById,
  addPageToCourse,
  updateCoursePage,
  deleteCoursePage,
} from "../api/course";
import type { Course, Page } from "../types/course";

const emptyPage: Page = {
  order: 1,
  type: "text",
  title: "",
  videoUrls: [],
  images: [],
  textContent: "",
  quizData: [],
};

const CourseDetailEditPage = () => {
  const { id: courseId, pageId } = useParams<{
    id: string;
    pageId: string;
  }>();

  const isCreateMode = pageId === "new";
  const isEditMode = pageId !== "new";

  const navigate = useNavigate();

  console.log(
    "CourseDetailEditPage - isEditMode:",
    isEditMode,
    "isCreateMode:",
    isCreateMode,
    "pageId:",
    pageId,
  );

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

        if (isEditMode && pageId) {
          console.log("CourseDetailEditPage - loaded course data");
          const existingPage = (data.pages ?? []).find((p) => p._id === pageId);

          if (!existingPage) {
            throw new Error("Page not found");
          }

          setPage(existingPage);
        } else {
          console.log("CourseDetailEditPage - creating new page");
          setPage({
            ...emptyPage,
            order: (data.pages ?? []).length + 1,
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
  }, [courseId, pageId]);

  /* ===================== Handlers ===================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);

      if (isEditMode && pageId) {
        await updateCoursePage(courseId, pageId, page);
      } else {
        await addPageToCourse(courseId, page);
      }
      navigate(`/course/edit/${courseId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save page");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!courseId || !pageId) return;
    if (!window.confirm(`Delete page "${page.title}"?`)) return;

    try {
      setLoading(true);
      await deleteCoursePage(courseId, pageId);
      navigate(`/course/edit/${courseId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete page");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  /* ===================== UI ===================== */

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
            <option value="image">Image</option>
          </select>

          {/* TEXT */}
          {page.type === "text" && (
            <textarea
              name="textContent"
              value={page.textContent}
              onChange={handleChange}
              rows={5}
              placeholder="Text content"
              className="w-full border rounded px-3 py-2"
            />
          )}

          {/* VIDEO */}
          {page.type === "video" && (
            <input
              value={(page.videoUrls ?? [])[0] || ""}
              onChange={(e) =>
                setPage({ ...page, videoUrls: [e.target.value] })
              }
              placeholder="YouTube video URL"
              className="w-full border rounded px-3 py-2"
            />
          )}

          {/* QUIZ */}
          {page.type === "quiz" && (
            <div className="space-y-4">
              {(page.quizData ?? []).map((q, qIndex) => (
                <div key={qIndex} className="border rounded p-4 space-y-2">
                  <input
                    value={q.question}
                    onChange={(e) => {
                      const quizData = [...(page.quizData ?? [])];
                      quizData[qIndex].question = e.target.value;
                      setPage({ ...page, quizData });
                    }}
                    placeholder={`Question ${qIndex + 1}`}
                    className="w-full border rounded px-3 py-2"
                  />

                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() => {
                          const quizData = [...(page.quizData ?? [])];
                          quizData[qIndex].correctAnswerIndex = oIndex;
                          setPage({ ...page, quizData });
                        }}
                      />
                      <input
                        value={opt}
                        onChange={(e) => {
                          const quizData = [...(page.quizData ?? [])];
                          quizData[qIndex].options[oIndex] = e.target.value;
                          setPage({ ...page, quizData });
                        }}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 border rounded px-2 py-1"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const quizData = (page.quizData ?? []).filter(
                        (_, i) => i !== qIndex,
                      );
                      setPage({ ...page, quizData });
                    }}
                    className="text-sm text-red-600"
                  >
                    Delete Question
                  </button>
                </div>
              ))}

              <button
                onClick={() =>
                  setPage({
                    ...page,
                    quizData: [
                      ...(page.quizData ?? []),
                      {
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswerIndex: 0,
                      },
                    ],
                  })
                }
                className="border px-3 py-2 rounded"
              >
                + Add Question
              </button>
            </div>
          )}

          {/* IMAGE */}
          {page.type === "image" && (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    setPage({
                      ...page,
                      images: [...(page.images ?? []), reader.result as string],
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                {(page.images ?? []).map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="Uploaded" className="rounded border" />
                    <button
                      onClick={() => {
                        const images = (page.images ?? []).filter(
                          (_, i) => i !== index,
                        );
                        setPage({ ...page, images });
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-violet-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Page"}
          </button>

          {isEditMode && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="border border-red-500 text-red-600 px-4 py-2 rounded"
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
