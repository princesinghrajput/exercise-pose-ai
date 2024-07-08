import React, { useState } from "react";
import CameraFeed from "./components/CameraFeed";
import PoseDetection from "./components/PoseDetection";

const App = () => {
  const [stream, setStream] = useState(null);

  return (
    <div>
      <div className="video-container">
        <CameraFeed onStream={setStream} />
        {stream && <PoseDetection stream={stream} />}
      </div>
    </div>
  );
};

export default App;
