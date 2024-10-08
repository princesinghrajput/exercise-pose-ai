import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { estimateSpinalPoints } from "../helpers/spinal-points";
import {
  normalizeKeypoints,
  fetchMajorAngles,
  findKeypoint,
  evaluateCondition,
} from "../helpers/common";
import { getReferencePose } from "../helpers/chair-stretches";
import Loader from "../common/Loader";

const PoseDetection = ({
  stream,
  referenceKeypoints,
  loading,
  setLoading,
  exercise,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [rep, setRep] = useState(0);
  const [stateCheck, setStateCheck] = useState(false);
  const stateRef = useRef(stateCheck);
  const [state, setState] = useState({
    stage: 1,
  });
  const stageRef = useRef(state.stage);

  const totalStages = exercise.poses.length;

  console.log("Exercise poses length", totalStages);
  console.log('Repitions', rep)

  const defaultFeedback = {
    notStarted: "Exercise has not started. Please get ready.",
    incorrectPose: "Please adjust your posture.",
  };

  const comparePoses = (realTime) => {
    const userPose = realTime.keypoints;
    const stage = stageRef.current;
  
    if (!userPose) return { isCorrect: false, message: [defaultFeedback.incorrectPose] };
  
    let isCorrect = false;
    let message = [defaultFeedback.incorrectPose];
  
    if (!stateRef.current) {
      let feedback_data = stepWiseFeedback(stageRef.current, userPose);
  
      isCorrect = feedback_data.length === 0;
      message = isCorrect ? ["Good job!"] : feedback_data;
  
      if (isCorrect) {
        if (stageRef.current === totalStages) {
          setRep((prevRep) => prevRep + 1);
          setState((prevState) => ({
            ...prevState,
            stage: 1, // Reset stage
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            stage: stageRef.current + 1,
          }));
        }
        setStateCheck(!stateCheck);
      }
    } else {
      message = [defaultFeedback.notStarted];
    }
  
    return { isCorrect, message };
  };

  const stepWiseFeedback = (step, userPose) => {
    let feedback_data = [];
    
    const [left_wrist_angle, right_wrist_angle, left_knee_angle, right_knee_angle] = fetchMajorAngles(userPose);
  
    const angles = {
      left_wrist_angle,
      right_wrist_angle,
      left_knee_angle,
      right_knee_angle,
    };
  
    const conditions = exercise.feedback[step] || [];
  
    conditions.forEach((condition) => {
      if (condition.condition) {
        let conditionMet = Object.keys(condition.condition).every((key) => {
          const [operator, value] = condition.condition[key].split(" ");
          return evaluateCondition(angles[key], operator, parseFloat(value));
        });
  
        if (conditionMet) {
          feedback_data.push(condition.feedback);
        } else {
          feedback_data = feedback_data.filter(item => item !== condition.feedback);
        }
      } else {
        feedback_data.push(condition.feedback);
      }
    });
  
    return feedback_data;
  };

  const drawKeypointsAndSkeleton = (keypoints, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    keypoints.forEach(({ x, y, score }) => {
      if (score > 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    const adjacentKeyPoints = posedetection.util.getAdjacentPairs(
      posedetection.SupportedModels.MoveNet
    );
    adjacentKeyPoints.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      if (kp1?.score > 0.5 && kp2?.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    });

    const spineIndices = keypoints
      .map((kp, idx) =>
        kp.name === "upper_spine" ||
        kp.name === "mid_spine" ||
        kp.name === "lower_spine"
          ? idx
          : null
      )
      .filter((idx) => idx !== null);

    for (let i = 0; i < spineIndices.length - 1; i++) {
      const kp1 = keypoints[spineIndices[i]];
      const kp2 = keypoints[spineIndices[i + 1]];
      if (kp1.score > 0.5 && kp2.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    }

    const video = videoRef.current;
    const normalizeKeypoint = normalizeKeypoints(
      keypoints,
      ctx.canvas.height,
      ctx.canvas.width
    );
    const [
      left_wrist_angle,
      right_wrist_angle,
      left_knee_angle,
      right_knee_angle,
    ] = fetchMajorAngles(normalizeKeypoint);

    const drawAngle = (angle, x, y) => {
      ctx.fillStyle = "yellow";
      ctx.font = "22px Arial";
      ctx.fillText(angle.toFixed(1) + "°", x, y);
    };

    const left_wrist_point = findKeypoint(keypoints, "left_elbow");
    if (left_wrist_point && left_wrist_point.score > 0.5)
      drawAngle(left_wrist_angle, left_wrist_point?.x, left_wrist_point?.y);

    const right_wrist_point = findKeypoint(keypoints, "right_elbow");
    if (right_wrist_point && right_wrist_point.score > 0.5)
      drawAngle(right_wrist_angle, right_wrist_point?.x, right_wrist_point?.y);

    const left_knee_point = findKeypoint(keypoints, "left_knee");
    if (left_knee_point && left_knee_point.score > 0.5)
      drawAngle(left_knee_angle, left_knee_point?.x, left_knee_point?.y);

    const right_knee_point = findKeypoint(keypoints, "right_knee");
    if (right_knee_point && right_knee_point.score > 0.5)
      drawAngle(right_knee_angle, right_knee_point?.x, right_knee_point?.y);
  };

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );
      setDetector(detector);
      setLoading(false);
    };
    setLoading(true);
    loadModel();
  }, []);

  useEffect(() => {
    if (detector && stream) {
      const video = videoRef.current;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
        const detectPose = async () => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            const ctx = canvasRef.current.getContext("2d");
            const poses = await detector.estimatePoses(video);
            if (poses.length > 0) {
              const canvasCurrent = canvasRef.current;
              canvasCurrent.width = video.videoWidth;
              canvasCurrent.height = video.videoHeight;

              ctx.clearRect(0, 0, canvasCurrent.width, canvasCurrent.height);
              ctx.drawImage(
                video,
                0,
                0,
                canvasCurrent.width,
                canvasCurrent.height
              );

              const userPose = poses[0];
              const referencePose = getReferencePose(state.stage - 1);
              const comparisonResult = comparePoses(
                {
                  keypoints: normalizeKeypoints(
                    userPose.keypoints,
                    canvasCurrent.height,
                    canvasCurrent.width
                  ),
                },
                referencePose
              );
              setFeedback(comparisonResult?.message ?? []);
              let keypoints = [...userPose.keypoints];
              const spinalPoints = estimateSpinalPoints(keypoints);
              keypoints = [...keypoints, ...spinalPoints];
              drawKeypointsAndSkeleton(keypoints, ctx);
            }
          }
          requestAnimationFrame(detectPose);
        };
        detectPose();
      };
    }
  }, [detector, stream, referenceKeypoints]);

  useEffect(() => {
    stageRef.current = state.stage;
  }, [state.stage]);

  useEffect(() => {
    stateRef.current = true;
    setTimeout(() => {
      stateRef.current = false;
    }, 10000);
  }, [stateCheck]);

  if (loading) return <Loader />;

  return (
    <div className="html-video-player">
      <div
        style={{
          position: "relative",
          maxWidth: "350px",
          display: loading ? "none" : "block",
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "auto",
          }}
          width="800"
          height="700"
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
            transform: "rotateY(180deg)",
          }}
          width="800"
          height="700"
        />
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            color: "#fff",
            left: 0,
            right: 0,
            background: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <p>Rep: {rep}</p>
          {feedback && Array.isArray(feedback) && feedback.length ? (
            <p
              style={{
                color: feedback.includes("Good job!") ? "green" : "white",
              }}
            >
              Feedback: {feedback.join(", ")}
            </p>
          ) : (
            <p>{defaultFeedback.notStarted}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoseDetection;
