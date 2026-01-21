export interface IImage {
  url: string;
  caption?: string;
}

export interface IQuiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IPage {
  _id?: any;
  order: number;
  type: 'video' | 'text' | 'quiz' | 'image';
  title: string;
  videoUrls?: string[];
  images?: IImage[];
  textContent?: string;
  quizData?: IQuiz[];
}

export interface IResource {
  _id?: any;
  fileName: string;
  fileUrl: string;
}

export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  keywords?: string[];
  category?: string[];
  published: boolean;
  pages?: IPage[];
  resources?: IResource[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourseCard {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category?: string[];
  keywords?: string[];
  videoCount: number;
}

export interface ICourseDetail extends ICourse {
  pages: IPage[];
}
