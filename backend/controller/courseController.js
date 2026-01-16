import Course from "../models/Course.js";
import mongoose from "mongoose";

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

export const getCourseById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid course ID format" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Format pages according to mock data structure
    const formattedPages = (course.pages || []).map((page) => {
      const formattedPage = {
        order: page.order,
        type: page.type,
        title: page.title,
      };

      // Add type-specific fields
      if (page.type === "video") {
        formattedPage.videoUrl = page.videoUrls?.[0] || null;
      } else if (page.type === "text") {
        formattedPage.textContent = page.textContent;
      } else if (page.type === "quiz") {
        formattedPage.quizData = page.quizData;
      } else if (page.type === "image") {
        formattedPage.images = page.images;
      }

      return formattedPage;
    });

    const courseDetail = {
      _id: course._id,
      title: course.title,
      pages: formattedPages,
    };

    return res.status(200).json(courseDetail);
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
};

//