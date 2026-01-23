import type { Course } from '../types/course';

export const mockCourseData: Course = {
    "_id": "6966fb47ad54e70eff5d4402",
    "title": "Complete React Guide 2025",
    "description": "Learn React from scratch with hooks and Redux. Master the art of modern web development by building real-world projects.",
    "thumbnail": "https://picsum.photos/id/2/800/600",
    "published": true,
    "pages": [
      {
        "order": 1,
        "type": "video",
        "title": "Introduction to React",
        "videoUrls": ["https://www.youtube.com/watch?v=Ke90Tje7VS0"],
        "textContent": "Welcome to the course! In this video we will cover the basics.",
        "images": [],
        "quizData": []
      },
      {
        "order": 2,
        "type": "text",
        "title": "Setup Environment",
        "textContent": "To start, please install Node.js and VS Code. Make sure you have the latest version of npm installed.",
        "videoUrls": [],
        "images": [
          {
            "url": "https://picsum.photos/id/1/500/400",
            "caption": "NodeJS Logo"
          }
        ],
        "quizData": []
      },
      {
        "order": 3,
        "type": "quiz",
        "title": "React Basics Quiz",
        "videoUrls": [],
        "textContent": "Test your knowledge before moving to the next section.",
        "images": [],
        "quizData": [
          {
            "question": "What is a Component?",
            "options": ["A function", "A database", "A server"],
            "correctAnswerIndex": 0
          },
          {
            "question": "Does React use Virtual DOM?",
            "options": ["Yes", "No"],
            "correctAnswerIndex": 0
          }
        ]
      }
    ],
    "resources": [
      {
        "fileName": "cheat-sheet.pdf",
        "fileUrl": "http://example.com/pdf"
      },
      {
        "fileName": "project-starter-code.zip",
        "fileUrl": "http://example.com/zip"
      }
    ],
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z",
    "category": ["Development", "Web"],
    "keywords": ["React", "Frontend", "JavaScript"]
  };
