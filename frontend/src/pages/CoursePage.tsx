import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import CourseContentList from '../components/course/CourseContentList';
import { mockCourseData } from '../data/mockCourse';
import { getCourseById } from '../api/course';
import type { Course } from '../types/course';

const CoursePage = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    // Mock data toggle
    const USE_MOCK_DATA = false;

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            if (USE_MOCK_DATA) {
                console.log("⚠️ Using MOCK Data");
                
                setTimeout(() => {
                    setCourse(mockCourseData);
                    setLoading(false);
                }, 500);
                
                return;
            }
            try {
                if (!id) {
                    setCourse(null);
                    setLoading(false);
                    return;
                }

                const data = await getCourseById(id);
                console.log("Fetched course data:", data);
                // Validate that we have a course with required fields
                if (data && data.title && data.description && data.thumbnail) {
                    setCourse(data);
                } else {
                    console.warn("Course data is invalid or missing required fields:", data);
                    setCourse(null);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleStartLearningClick = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-violet-600 text-xl font-semibold animate-pulse">Loading course...</div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-500 text-xl">Course not found.</div>
        </div>
    );

    // 动态计算视频数量 (过滤掉非视频页面)
    const videoCount = course.pages ? course.pages.filter(p => p.type === 'video').length : 0;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

            <Header />

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* --- Hero Card --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">

                        {/* Left Side: Thumbnail */}
                        <div className="relative h-64 md:h-auto bg-slate-200">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Right Side: Info */}
                        <div className="p-8 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                    ID: <span className="font-mono ml-1">{id || 'MOCK-ID'}</span>
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                                {course.title}
                            </h1>

                            <div className="flex items-center space-x-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-violet-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {videoCount} Videos
                                </div>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={handleStartLearningClick}
                                    className="w-full md:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                                    Start Learning Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content Section */}
                <div ref={contentRef} className="max-w-4xl mx-auto grid grid-cols-1 gap-12">
                    
                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About this Course</h2>
                        <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed">
                            <p>{course.description}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Content</h2>
                        <CourseContentList pages={course.pages || []} /> 
                    </div>


                </div>

            </main>
        </div>
    );
};

export default CoursePage;
