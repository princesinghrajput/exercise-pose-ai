import React, { useState } from "react";
import CameraFeed from "../../components/CameraFeed";
import PoseDetection from "../../components/PoseDetection";
import DemoVideo from "../../demo-poses/chair-sitting-exercise/chair-situps.mp4";
import "./home.css";

const Home = () => {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      {/* <a href="/keypoint-extractor">Extract Points</a> */}
      <div className="home-container">
        <div>
          <div className="video-container">
            <CameraFeed onStream={setStream} />
            {stream && (
              <PoseDetection
                stream={stream}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </div>
        </div>
        {!loading ? (
          <video
            src={DemoVideo}
            style={{
              // position: "absolute",
              // top: 0,
              // left: 0,
              maxHeight: "262.5px",
            }}
            width="640"
            height="480"
            autoPlay
            loop
            playsInline
            controls
          />
        ) : null}
      </div>
    </>
  );
};

export default Home;
