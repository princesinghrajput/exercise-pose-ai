import React from "react";
import KeypointExtractor from "./components/KeypointsExtractor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ExerciseHandlerPage from "./pages/ExerciseHandlerPage";
import Home from "./pages/Home";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/keypoint-extractor",
      element: <KeypointExtractor />,
    },
    {
      path: "/exercise/:id",
      element: <ExerciseHandlerPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
