import React from 'react';

const CourseContentList = ({ pages }) => {

  const getEmbedUrl = (url) => {
    if (!url) return "";
    return url.replace("watch?v=", "embed/");
  };

  if (!pages || pages.length === 0) {
    return <div className="text-slate-500">No content available.</div>;
  }

  return (
    <div className="space-y-12">
      {pages.map((page, index) => {
        // no quiz for now
        if (page.type === 'quiz') return null;

        return (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            {/* title&type*/}
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-bold text-sm">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold text-slate-900">
                {page.title}
              </h3>
              <span className="ml-auto text-xs font-mono uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded">
                {page.type}
              </span>
            </div>

            {/* text */}
            {page.textContent && (
              <p className="text-slate-600 mb-6 leading-relaxed">
                {page.textContent}
              </p>
            )}

            {/* video */}
            {page.type === 'video' && page.videoUrls && page.videoUrls.length > 0 && (
              <div className="space-y-4">
                {page.videoUrls.map((url, i) => (
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

            {/* image */}
            {page.images && page.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {page.images.map((img, i) => (
                  <figure key={i} className="rounded-lg overflow-hidden border border-slate-100">
                    <img 
                      src={img.url} 
                      alt={img.caption || "Course content"} 
                      className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                    />
                    {img.caption && (
                      <figcaption className="bg-slate-50 p-2 text-xs text-center text-slate-500">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;