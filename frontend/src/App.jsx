import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/Home/HomePage";
import CoursePage from "./pages/CoursePage";
import CourseEditSearchPage from "./pages/CourseEditSearchPage";
import CourseEditPage from "./pages/CourseEditPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/course/edit-search",
    element: <CourseEditSearchPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/course/edit/:id",
    element: <CourseEditPage />,
    errorElement: <NotFoundPage />,
  },
    {
    path: "/course/edit",
    element: <CourseEditPage />,
    errorElement: <NotFoundPage />,
  },
  //course detail page route
  {
    path: "/course/:id",
    element: <CoursePage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App
