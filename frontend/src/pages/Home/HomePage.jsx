import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import CourseSection from "../../components/home/CourseSection";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ 新增 loading 状态

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/courses");

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();
        // 兼容不同的后端返回格式 (直接数组 或 { data: [] })
        const courseList = Array.isArray(data) ? data : data.courses || data.data || [];
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // ✅ 结束加载
      }
    };
    fetchCourses();
  }, []);

  // 提取所有分类并去重
  const categories = [...new Set(courses.flatMap((course) => course.category || []))].filter(Boolean);

  // --- Loading 界面 ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading amazing courses...</p>
       </div>
    </div>
  );

  return (
    // ✅ 1. 统一背景风格 (和 CoursePage 一致)
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />
      
      <Header />

      <main className="relative">

        {/* ✅ 3. 课程列表区域 (限制最大宽+居中) */}
        <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8 pb-20 space-y-16">
          
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category} className="animate-fade-in-up">
                {/* 在这里我们不需要写样式，因为 CourseSection 内部应该处理好了标题样式。
                   我们只需要传入 filtered 后的 courses 即可，或者让 CourseSection 自己滤。
                   根据你之前的代码，CourseSection 似乎会自己过滤，所以保持原样传入 courses。
                */}
                <CourseSection category={category} courses={courses} />
              </div>
            ))
          ) : (
             // 空状态处理
             <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No courses found yet.</p>
             </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default HomePage;