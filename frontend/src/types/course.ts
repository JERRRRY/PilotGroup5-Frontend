// Type definitions based on the backend Mongoose schema

export interface Image {
  url: string;
  caption?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type PageType = 'video' | 'text' | 'quiz' | 'image';

export interface Page {
  _id?: string; 
  order: number;
  type: PageType;
  title: string;
  videoUrls?: string[];
  images?: string[];
  textContent?: string;
  quizData?: QuizQuestion[];
}

export interface Resource {
  fileName: string;
  fileUrl: string;
}

export interface Course {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  keywords?: string[];
  category?: string[];
  published?: boolean;
  pages?: Page[];
  resources?: Resource[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  thumbnail: string;
  keywords?: string[];
  category?: string[];
  published?: boolean;
  pages?: Page[];
  resources?: Resource[];
}
