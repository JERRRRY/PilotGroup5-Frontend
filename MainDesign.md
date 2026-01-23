### Sample MongoDB scheme 
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: String, 
  thumbnail: String,
  Keywords: [string],
  Category: [string],
  published: { type: Boolean, default: false },
  pages: [{ order: Number, type: { type: String, enum: ['video', 'text', 'quiz', 'image'] }, 
title: String, videoUrls: [String], // Change videoUrl to an array images: [{ url: String, caption: String }], // Add an image array textContent: String, quizData: [...] }]
  resources: [{ fileName: String, fileUrl: String }]
});

### Api Defination 
1. API: GET All Courses (Home Page)
This API provides the data for the "Modern Design" grid layout.
Endpoint: GET /api/v1/courses
Goal: To populate the Home Page with course cards.
Mock Data:
```json
[
  {
    "_id": "c001",
    "title": "Modern Web Design with React",
    "thumbnail": "https://picsum.photos/seed/react/400/250",
    "description": "Master the art of UI/UX in React.",
    "category": ["Design", "Frontend"],
    "keywords": ["React", "UI/UX", "CSS"],
    "videoCount": 3
  },
  {
    "_id": "c002",
    "title": "Backend Scalability with Node.js",
    "thumbnail": "https://picsum.photos/seed/node/400/250",
    "description": "Build high-performance CMS systems.",
    "category": ["Backend", "Development"],
    "keywords": ["Node.js", "Express", "Database"],
    "videoCount": 5
  },
  {
    "_id": "c003",
    "title": "Full Stack Web Development",
    "thumbnail": "https://picsum.photos/seed/fullstack/400/250",
    "description": "Complete MERN stack learning journey.",
    "category": ["Full Stack", "Development"],
    "keywords": ["MERN", "MongoDB", "React"],
    "videoCount": 8
  }
]
```


2. API: GET Course Details (Updated Mock Data)
Endpoint: GET /api/v1/courses/:id 
Goal: This data allows the Frontend to build a "Next/Previous" navigation flow.
JSON
{
  "_id": "c101",
  "title": "Introduction to MERN",
  "pages": [
    {
      "_id": "page_001",
      "order": 1,
      "type": "video",
      "title": "Welcome to the Course",
      "videoUrls": ["https://www.w3schools.com/html/mov_bbb.mp4"]
    },
    {
      "_id": "page_002",
      "order": 2,
      "type": "text",
      "title": "Core Concepts",
      "textContent": "The MERN stack consists of MongoDB, Express, React, and Node.js."
    },
    {
      "_id": "page_003",
      "order": 3,
      "type": "quiz",
      "title": "Final Knowledge Check",
      "quizData": [
        {
          "question": "What does the 'R' in MERN stand for?",
          "options": ["Ruby", "React", "Redux"],
          "correctAnswerIndex": 1
        },
        {
          "question": "Which database is used in MERN?",
          "options": ["MySQL", "PostgreSQL", "MongoDB"],
          "correctAnswerIndex": 2
        }
      ]
    }
  ]
}

3. API: POST Create Course (CMS)
Endpoint: POST /api/v1/courses
Purpose: To allow teachers to create new courses via the CMS.

**Note:** The `pages` field is optional. You can either:
1. Create a course with pages included
2. Create an empty course and add pages later using API 7

Request Body:
```json
{
  "title": "AI Agent Integration 101",
  "description": "Future-proofing your MERN app for AI.",
  "category": ["AI", "Development"],
  "keywords": ["AI", "Integration", "Agent"],
  "thumbnail": "https://picsum.photos/seed/ai/400/250",
  "published": false,
  "pages": [
    {
      "order": 1,
      "type": "video",
      "title": "Getting Started",
      "videoUrls": ["https://www.example.com/intro.mp4"]
    },
    {
      "order": 2,
      "type": "text",
      "title": "Introduction",
      "textContent": "Learn about AI agent integration with MERN."
    }
  ]
}
```
Mock Success Response:
```json
{
  "message": "Course created successfully",
  "data": {
    "_id": "new_999",
    "title": "AI Agent Integration 101",
    "description": "Future-proofing your MERN app for AI.",
    "createdAt": "2025-01-12T10:00:00Z"
  }
}
```

4. API: PUT Update Course (CMS)
Endpoint: PUT /api/v1/courses/:id
Purpose: To update an existing course's details, content, and pages.
Request Body:
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "thumbnail": "https://picsum.photos/seed/updated/400/250",
  "category": ["Design", "Advanced"],
  "keywords": ["Updated", "Keywords"],
  "published": false,
  "pages": [
    {
      "order": 1,
      "type": "video",
      "title": "Updated Video Title",
      "videoUrls": ["https://www.example.com/video1.mp4"]
    }
  ],
  "resources": [
    {
      "fileName": "resource.pdf",
      "fileUrl": "https://example.com/resource.pdf"
    }
  ]
}
```
Mock Success Response:
```json
{
  "message": "Course updated successfully",
  "data": {
    "_id": "c101",
    "title": "Updated Course Title",
    "updatedAt": "2025-01-15T14:30:00Z"
  }
}
```

5. API: DELETE Course (CMS)
Endpoint: DELETE /api/v1/courses/:id
Purpose: To delete a course and all its associated content from the CMS.
Mock Success Response:
```json
{
  "message": "Course deleted successfully",
  "data": {
    "_id": "c101"
  }
}
```

6. API: GET All Courses (CMS Dashboard)
Endpoint: GET /api/v1/cms/courses
Purpose: To retrieve all courses with pagination for the CMS dashboard (admin view).
Query Parameters: page, limit, status (published/draft)
Mock Success Response:
```json
{
  "message": "Courses retrieved successfully",
  "data": [
    {
      "_id": "c001",
      "title": "Modern Web Design with React",
      "status": "published",
      "pagesCount": 12,
      "createdAt": "2025-01-10T10:00:00Z",
      "updatedAt": "2025-01-15T14:30:00Z",
      "author": "Teacher Name"
    },
    {
      "_id": "c002",
      "title": "Backend Scalability with Node.js",
      "status": "draft",
      "pagesCount": 8,
      "createdAt": "2025-01-12T10:00:00Z",
      "updatedAt": "2025-01-14T09:15:00Z",
      "author": "Another Teacher"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 45,
    "limit": 10
  }
}
```

7. API: POST Add Page to Course (CMS)
Endpoint: POST /api/v1/courses/:id/pages
Purpose: To add a new page (video, text, quiz, or image) to an existing course.
Request Body:
```json
{
  "order": 4,
  "type": "quiz",
  "title": "Module Quiz",
  "quizData": [
    {
      "question": "What is the main benefit of MERN?",
      "options": ["Speed", "Scalability", "Full JavaScript stack"],
      "correctAnswerIndex": 2
    }
  ]
}
```
Mock Success Response:
```json
{
  "message": "Page added successfully",
  "data": {
    "_id": "page_123",
    "order": 4,
    "type": "quiz",
    "courseId": "c101"
  }
}
```

8. API: PUT Update Course Page (CMS)
Endpoint: PUT /api/v1/courses/:id/pages/:pageId
Purpose: To update the content of a specific page within a course.
Request Body:
```json
{
  "title": "Updated Page Title",
  "textContent": "Updated text content here",
  "videoUrls": ["https://www.example.com/updated-video.mp4"],
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "caption": "Image caption"
    }
  ]
}
```
Mock Success Response:
```json
{
  "message": "Page updated successfully",
  "data": {
    "_id": "page_123",
    "order": 4,
    "type": "text",
    "courseId": "c101"
  }
}
```

9. API: DELETE Course Page (CMS)
Endpoint: DELETE /api/v1/courses/:id/pages/:pageId
Purpose: To remove a page from a course.
Mock Success Response:
```json
{
  "message": "Page deleted successfully",
  "data": {
    "pageId": "page_123",
    "courseId": "c101"
  }
}
```

10. API: PUT Publish/Unpublish Course (CMS)
Endpoint: PUT /api/v1/courses/:id/publish
Purpose: To toggle the publish status of a course (make it visible to students or hide it).
Request Body:
```json
{
  "published": true
}
```
Mock Success Response:
```json
{
  "message": "Course published successfully",
  "data": {
    "_id": "c101",
    "title": "Introduction to MERN",
    "published": true,
    "publishedAt": "2025-01-15T14:30:00Z"
  }
}
```

11. API: POST Upload Resource (CMS)
Endpoint: POST /api/v1/courses/:id/resources
Purpose: To upload course resources (PDFs, documents, etc.) to a course.
Request Body (Form Data):
```
file: [binary file data]
fileName: "Course Guide.pdf"
```
Mock Success Response:
```json
{
  "message": "Resource uploaded successfully",
  "data": {
    "_id": "resource_456",
    "fileName": "Course Guide.pdf",
    "fileUrl": "https://storage.example.com/resources/course-guide-456.pdf",
    "courseId": "c101",
    "uploadedAt": "2025-01-15T14:30:00Z"
  }
}
```

12. API: DELETE Course Resource (CMS)
Endpoint: DELETE /api/v1/courses/:id/resources/:resourceId
Purpose: To remove a resource from a course.
Mock Success Response:
```json
{
  "message": "Resource deleted successfully",
  "data": {
    "resourceId": "resource_456",
    "courseId": "c101"
  }
}
```



