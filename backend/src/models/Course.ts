import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from '../types/course.js';

interface ICourseDocument extends Omit<ICourse, '_id'>, Document {}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    keywords: [{
      type: String,
    }],
    category: [{
      type: String,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    pages: [{
      order: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'image'],
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      videoUrls: [{
        type: String,
      }],
      images: [{
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
        },
      }],
      textContent: {
        type: String,
      },
      quizData: [{
        question: {
          type: String,
          required: true,
        },
        options: [{
          type: String,
          required: true,
        }],
        correctAnswerIndex: {
          type: Number,
          required: true,
        },
      }],
    }],
    resources: [{
      fileName: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourseDocument>('Course', courseSchema);

export default Course;
