import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/Home/HomePage";
import CoursePage from "./pages/CoursePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
