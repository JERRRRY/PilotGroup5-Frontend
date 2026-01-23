import CourseCard from "./CourseCard";
import type { Course } from '../../types/course';

interface CourseSectionProps {
  category: string;
  courses: Course[];
}

const CourseSection = ({ category, courses }: CourseSectionProps) => {
  // 过滤逻辑保持不变
  const categoryCourses = courses.filter(
    (course) => course.category && course.category.includes(category)
  );

  if (categoryCourses.length === 0) return null;

  return (
    // 移除 bg-[#fbf8f1] 和 max-w-7xl (因为父级 HomePage 已经限制了 max-w)
    // 移除 mt-20，由父级的 space-y 控制间距
    <section className="w-full">
      
      {/* 标题栏：增加紫色装饰竖条 */}
      <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1.5 bg-violet-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {category}
              </h2>
           </div>
           <p className="text-slate-500 text-sm ml-4.5 pl-1">
             Explore our top-rated {category.toLowerCase()} courses
           </p>
        </div>
        
        {/* Pending View All 按钮 */}
        {/* <button className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors hidden sm:block">
          View All {category} &rarr;
        </button> */}
      </div>

      {/* Grid 布局保持不变 */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCourses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CourseSection;
