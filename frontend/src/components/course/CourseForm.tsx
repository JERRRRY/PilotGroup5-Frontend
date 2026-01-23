import type { Course } from '../../types/course';

interface CourseFormProps {
  course: Course;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CourseForm = ({ course, onChange }: CourseFormProps) => {
  return (
    <div className="space-y-4">
      <input
        name="title"
        value={course.title}
        onChange={onChange}
        placeholder="Course title"
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="description"
        value={course.description}
        onChange={onChange}
        placeholder="Description"
        className="w-full border rounded px-3 py-2"
      />

      <input
        name="thumbnail"
        value={course.thumbnail}
        onChange={onChange}
        placeholder="Thumbnail URL"
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
};

export default CourseForm;
