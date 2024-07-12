import React from "react";
import KeypointExtractor from "./components/KeypointsExtractor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";

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
  ]);

  return <RouterProvider router={router} />;
};

export default App;
