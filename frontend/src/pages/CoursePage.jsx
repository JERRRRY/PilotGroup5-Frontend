import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch("https://mocki.io/v1/a1a06a15-af32-4ed8-ac4a-da66ff69a343");

                if (!res.ok) {
                    throw new Error("Failed to fetch courses");
                }

                const data = await res.json();

                const foundCourse = data.find((c) => c._id === id);

                setCourse(foundCourse);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-violet-600 text-xl font-semibold">Loading course...</div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-500 text-xl">Course not found.</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

            <Header />

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* whole card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">

                        {/* left side */}
                        <div className="relative h-64 md:h-auto bg-slate-200">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            {/* fake play button */}
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center group cursor-pointer hover:bg-black/20 transition">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-violet-600 ml-1">
                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* right side */}
                        <div className="p-8 flex flex-col justify-center">
                            {/* course ID */}
                            <div className="mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                    ID: <span className="font-mono ml-1">{id}</span>
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
                                {course.title}
                            </h1>

                            {/* video count */}
                            <div className="flex items-center space-x-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center">
                                    {course.videoCount} Videos
                                </div>
                                
                            </div>

                            <div className="mt-8">
                                <button className="w-full md:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                                    Start Learning Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* course description */}
                <div className="mt-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">About this Course</h2>
                    <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed">
                        <p>{course.description}</p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default CoursePage;