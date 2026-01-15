import Course from "../models/Course.js";
export const getAllCourses = async (req, res) => {
  try {
    // Query all published courses from MongoDB
    const courses = await Course.find();
    
    // Calculate videoCount and format response
    const courseCards = courses.map((course) => {
      const videoCount = (course.pages || []).filter(
        (page) => page.type === "video"
      ).length;
      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category || course.Category,
        keywords: course.keywords || course.Keywords,
        videoCount: videoCount,
      };
    });
    return res.status(200).json({ success: true, data: courseCards });
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};
