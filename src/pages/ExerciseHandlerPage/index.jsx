import React, { useEffect, useState } from "react";
import CameraFeed from "../../components/CameraFeed";
import PoseDetection from "../../components/PoseDetection";
import DemoVideo from "../../demo-poses/chair-sitting-exercise/chair-situps.mp4";
import FrozenExercise from "../../demo-poses/frozen-shoulder-exercise/frozen-shoulder-exercise.mp4";
import PushUpVideo from "../../demo-poses/push-up/push-up.mp4"; // Add this
import "./style.css";
import { useParams } from "react-router-dom";
import { getExercisePosesAndAngles } from "../../helpers/chair-stretches";

const ExerciseHandler = () => {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState({
    name: "",
    url: "",
    id: "",
    poses: [],
    feedback: {},
  });
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      let name;
      let videoUrl;

      switch (params.id) {
        case '1':
          name = "chair-stretches";
          videoUrl = DemoVideo;
          break;
        case '2':
          name = "frozen-shoulder-exercise";
          videoUrl = FrozenExercise;
          break;
        case '3':
          name = "push-ups"; // Add this case
          videoUrl = PushUpVideo;
          break;
        default:
          name = "chair-stretches";
          videoUrl = DemoVideo;
      }

      const exerciseDetail = getExercisePosesAndAngles(name);
      setExercise({
        name,
        url: videoUrl,
        id: params.id,
        poses: exerciseDetail?.poses || [],
        feedback: exerciseDetail?.feedback || {},
      });
    }
  }, [params]);

  return (
    <>
      <div className="home-container">
        {!loading ? <h1 style={{ textAlign: "center" }}>{exercise?.name}</h1> : null}
        <div>
          <div className="video-container" style={{ marginTop: "30px" }}>
            <CameraFeed onStream={setStream} />
            {stream && (
              <PoseDetection
                stream={stream}
                loading={loading}
                setLoading={setLoading}
                exercise={exercise}
              />
            )}
          </div>
        </div>
        {!loading ? (
          <video
            src={exercise.url}
            style={{
              maxHeight: "262.5px",
              transform: "revert",
              marginLeft: "30px",
              textAlign: "center",
              marginTop: "30px"
            }}
            width="640"
            height="480"
            autoPlay
            loop
            playsInline
            muted
            controls
          />
        ) : null}
      </div>
    </>
  );
};

export default ExerciseHandler;
