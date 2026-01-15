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
      "order": 1,
      "type": "video",
      "title": "Welcome to the Course",
      "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      "order": 2,
      "type": "text",
      "title": "Core Concepts",
      "textContent": "The MERN stack consists of MongoDB, Express, React, and Node.js."
    },
    {
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

3. API: POST Create/Update Course (CMS)
Endpoint: POST /api/v1/courses
Purpose: To allow teachers to create new courses or edit existing ones via the CMS.
Request Body / Mock Success Response:
JSON
{
  "message": "Course created successfully",
  "data": {
    "_id": "new_999",
    "title": "AI Agent Integration 101",
    "description": "Future-proofing your MERN app for AI.",
    "videos": [],
    "createdAt": "2025-01-12T10:00:00Z"
  }
}



