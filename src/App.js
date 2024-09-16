import React from "react";
import KeypointExtractor from "./components/KeypointsExtractor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ExerciseHandlerPage from "./pages/ExerciseHandlerPage";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExercisePage from './components/ExercisePage.jsx'
const App = () => {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Home />,
  //   },
  //   {
  //     path: "/keypoint-extractor",
  //     element: <KeypointExtractor />,
  //   },
  //   {
  //     path: "/exercise/:id",
  //     element: <ExerciseHandlerPage />,
  //   },
  // ]);

  // return <RouterProvider router={router} />;

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExercisePage/>} />
        <Route path="/keypoint-extractor" element={<KeypointExtractor />} />
        <Route path="/exercise/:id" element={<ExerciseHandlerPage />} />
      </Routes>
    </BrowserRouter>
  )


};

export default App;
