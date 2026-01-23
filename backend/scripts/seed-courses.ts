import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course';

dotenv.config();

const sampleCourses = [
  {
    title: "Modern Web Design with React",
    description: "Master the art of UI/UX in React with practical examples.",
    thumbnail: "https://picsum.photos/seed/react/400/250",
    category: ["Design", "Frontend"],
    keywords: ["React", "UI/UX", "CSS"],
    published: true,
    pages: [
      {
        order: 1,
        type: "video",
        title: "Welcome to React Design",
        videoUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      },
      {
        order: 2,
        type: "text",
        title: "Core Concepts",
        textContent: "React is a JavaScript library for building user interfaces with reusable components.",
      },
      {
        order: 3,
        type: "quiz",
        title: "React Basics Quiz",
        quizData: [
          {
            question: "What is React?",
            options: ["A framework", "A library", "A tool"],
            correctAnswerIndex: 1,
          },
          {
            question: "What are components?",
            options: ["CSS files", "Reusable UI elements", "HTML tags"],
            correctAnswerIndex: 1,
          },
        ],
      },
    ],
    resources: [],
  },
  {
    title: "Backend Scalability with Node.js",
    description: "Build high-performance and scalable backend systems.",
    thumbnail: "https://picsum.photos/seed/node/400/250",
    category: ["Backend", "Development"],
    keywords: ["Node.js", "Express", "Database"],
    published: true,
    pages: [
      {
        order: 1,
        type: "video",
        title: "Node.js Fundamentals",
        videoUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      },
      {
        order: 2,
        type: "text",
        title: "Building Scalable Systems",
        textContent: "Learn about clustering, load balancing, and database optimization.",
      },
      {
        order: 3,
        type: "image",
        title: "Architecture Diagram",
        images: [
          {
            url: "https://picsum.photos/id/1/500/400",
            caption: "Scalable Node.js Architecture",
          },
        ],
      },
    ],
    resources: [],
  },
  {
    title: "Full Stack Web Development",
    description: "Complete MERN stack learning journey from frontend to database.",
    thumbnail: "https://picsum.photos/seed/fullstack/400/250",
    category: ["Full Stack", "Development"],
    keywords: ["MERN", "MongoDB", "React"],
    published: true,
    pages: [
      {
        order: 1,
        type: "text",
        title: "What is MERN Stack",
        textContent: "MERN stands for MongoDB, Express, React, and Node.js - a complete JavaScript stack.",
      },
      {
        order: 2,
        type: "video",
        title: "Setting Up Your Environment",
        videoUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      },
      {
        order: 3,
        type: "quiz",
        title: "MERN Stack Quiz",
        quizData: [
          {
            question: "What database does MERN use?",
            options: ["MySQL", "PostgreSQL", "MongoDB"],
            correctAnswerIndex: 2,
          },
          {
            question: "Which framework is for routing in Node.js?",
            options: ["React", "Express", "MongoDB"],
            correctAnswerIndex: 1,
          },
        ],
      },
    ],
    resources: [],
  },
  {
    title: "TypeScript for Advanced Developers",
    description: "Master TypeScript for building robust and scalable applications.",
    thumbnail: "https://picsum.photos/seed/typescript/400/250",
    category: ["Development", "Advanced"],
    keywords: ["TypeScript", "OOP", "Type Safety"],
    published: false,
    pages: [
      {
        order: 1,
        type: "text",
        title: "Introduction to TypeScript",
        textContent: "TypeScript is a typed superset of JavaScript that compiles to clean JavaScript code.",
      },
      {
        order: 2,
        type: "video",
        title: "Advanced Type System",
        videoUrls: ["https://www.w3schools.com/html/mov_bbb.mp4"],
      },
    ],
    resources: [],
  },
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/course-platform');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const result = await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully seeded ${result.length} courses`);

    result.forEach((course) => {
      console.log(`- ${course.title} (${course._id})`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
