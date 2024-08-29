import React, { useEffect, useState } from "react";
import CameraFeed from "../../components/CameraFeed";
import PoseDetection from "../../components/PoseDetection";
import DemoVideo from "../../demo-poses/chair-sitting-exercise/chair-situps.mp4";
import FrozenExercise from "../../demo-poses/frozen-shoulder-exercise/frozen-shoulder-exercise.mp4";
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
      const name =
        params.id == 1 ? "chair-stretches" : "frozen-shoulder-exercice";
      const exerciseDetail = getExercisePosesAndAngles(name);
      console.log(exerciseDetail, name);
      setExercise((prev) => ({
        ...prev,
        name,
        url: params.id === 1 ? DemoVideo : FrozenExercise,
        id: params.id,
        poses: exerciseDetail.poses,
        feedback: exerciseDetail.feedback,
      }));
    }
  }, [params]);

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
