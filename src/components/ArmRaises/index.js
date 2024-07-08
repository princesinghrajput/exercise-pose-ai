import React, { useState } from "react";
import CameraFeed from "./CameraFeed";
import PoseDetection from "./PoseDetection";

const ArmRaises = () => {
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

export default ArmRaises;
