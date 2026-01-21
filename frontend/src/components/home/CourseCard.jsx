import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  // 如果没有 pages 数组，默认为 0
  // 注意：这依赖于后端 getAllCourses 是否返回了 videoCount。
  // 如果后端没算，这里就临时算一下或者显示 0。
  const videoCount = course.videoCount || (course.pages ? course.pages.filter(p => p.type === 'video').length : 0);

  return (
    <Link to={`/course/${course._id}`} className="block group h-full">
      <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        
        {/* --- Image Section with Zoom Effect --- */}
        <div className="relative aspect-video bg-slate-200 overflow-hidden">
          <img
            src={course.thumbnail || "https://via.placeholder.com/400x225"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay: Play Icon (只有 hover 时显示) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-violet-600 ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
               </svg>
            </div>
          </div>

          {/* Badge (显示第一个 Tag) */}
          <div className="absolute top-3 right-3">
             {/* 优先显示 category 数组的第一个，如果没有则显示 keywords */}
             {(course.category?.[0] || course.keywords?.[0]) && (
                <span className="px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-700 rounded-md shadow-sm border border-slate-100">
                  {course.category?.[0] || course.keywords?.[0]}
                </span>
             )}
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-violet-700 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
            {course.description || "No description available."}
          </p>

          {/* Footer Stats */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-violet-500">
                 <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.753 9.753 0 00-5.929 1.509c-.369.238-.485.723-.26 1.09l.805 1.306c.213.346.656.47.998.304a8.23 8.23 0 012.953-.829c.45-.044.903-.021 1.351.064l.903 1.467c.27.44.775.663 1.28.534A9.733 9.733 0 0012 8.75a9.733 9.733 0 002.949.479c.506.129 1.01.394 1.28.534l.903-1.467c.449-.085.902-.108 1.352-.064.995.097 1.968.382 2.952.829.342.166.786.042.998-.304l.806-1.306c.225-.367.109-.852-.26-1.09A9.753 9.753 0 0018 3.75c-1.83 0-3.577.27-5.25.783-.483-.148-.98-.233-1.5-.233zm-8.205 8.402A8.25 8.25 0 0112 20.25a8.25 8.25 0 01-8.955-7.315zm17.91 0A8.25 8.25 0 0012 20.25a8.25 8.25 0 008.955-7.315zM12 10.5a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
              <span>{videoCount} Videos</span>
            </div>
            
            {/* 也可以加个 ID 或者 讲师名 */}
            {/* <span>ID: {course._id.slice(-4)}</span> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;