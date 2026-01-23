import React, { useState } from 'react';
import QuizSection from './QuizSection';

const CourseContentList = ({ pages }) => {
  // 1. 新增状态：记录当前在第几页 (索引从 0 开始)
  const [currentIndex, setCurrentIndex] = useState(0);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.replace("watch?v=", "embed/");
  };

  if (!pages || pages.length === 0) {
    return <div className="text-slate-500">No content available.</div>;
  }

  // 2. 获取当前要显示的页面数据
  const currentPage = pages[currentIndex];

  // 3. 翻页处理函数
  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      // 可选：翻页后自动滚动到顶部
      // window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // 计算进度百分比
  const progressPercentage = ((currentIndex + 1) / pages.length) * 100;

  return (
    <div className="space-y-6">
      
      {/* --- 顶部进度条 --- */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
        <span className="font-medium text-slate-700">
          Lesson {currentIndex + 1} of {pages.length}
        </span>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-mono">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* --- 主要内容卡片 (只渲染 currentPage) --- */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-[400px] flex flex-col">
        
        {/* Title & Type Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold text-sm">
            {currentIndex + 1}
          </span>
          <h3 className="text-xl font-semibold text-slate-900">
            {currentPage.title}
          </h3>
          <span className="ml-auto text-xs font-mono uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {currentPage.type}
          </span>
        </div>

        {/* Content Body (Flex-1 ensure it takes space) */}
        <div className="flex-1">
            {/* Text Content */}
            {currentPage.textContent && (
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                {currentPage.textContent}
              </p>
            )}

            {/* Video Content */}
            {currentPage.type === 'video' && currentPage.videoUrls && currentPage.videoUrls.length > 0 && (
              <div className="space-y-4">
                {currentPage.videoUrls.map((url, i) => (
                  <div key={i} className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                    <iframe 
                      src={getEmbedUrl(url)} 
                      title={`Video ${i}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            )}

            {/* Image Content */}
            {currentPage.images && currentPage.images.length > 0 && (
              <div className="grid grid-cols-1 gap-6 mt-4">
                {currentPage.images.map((img, i) => (
                  <figure key={i} className="rounded-lg overflow-hidden border border-slate-100">
                    <img 
                      src={img.url} 
                      alt={img.caption || "Course content"} 
                      className="w-full max-h-[400px] object-contain bg-slate-50"
                    />
                    {img.caption && (
                      <figcaption className="bg-slate-50 p-3 text-sm text-center text-slate-500 italic">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {/* Quiz Content */}
            {currentPage.type === 'quiz' && currentPage.quizData && currentPage.quizData.length > 0 && (
              <QuizSection quizData={currentPage.quizData} />
            )}
        </div>

      </div>

      {/* --- 底部导航按钮 --- */}
      <div className="flex items-center justify-between pt-4">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentIndex === 0 
              ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Previous
        </button>

        <button 
          onClick={handleNext}
          disabled={currentIndex === pages.length - 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm ${
            currentIndex === pages.length - 1
              ? "bg-slate-100 text-slate-300 cursor-not-allowed" // 如果想在最后一页变成 "完成" 按钮，可以在这里改逻辑
              : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-md"
          }`}
        >
          Next Lesson
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

    </div>
  );
};

export default CourseContentList;