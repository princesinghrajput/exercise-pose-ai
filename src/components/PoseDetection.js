import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { estimateSpinalPoints } from "../helpers/spinal-points";
import {
  normalizeKeypoints,
  calculateDistance,
  getDirection,
} from "../helpers/common";
import { getReferencePose } from "../helpers/reference";

const PoseDetection = ({ stream, referenceKeypoints }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [stepCounter, setStepCounter] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const comparePoses = (realTimeData, demoData) => {
    if (!realTimeData || !demoData)
      return { isCorrect: false, message: "Invalid pose data" };
    const userPose = normalizeKeypoints(realTimeData.keypoints, 704, 1244);
    // Scale referencePose keypoints
    const referencePose = normalizeKeypoints(
      demoData,
      currentStep === 1 ? 642 : 704,
      1244
    );

    // const angle = handleComparison(userPose);
    // console.log("Angle: ", angle);
    // const imutableState = { ...state };
    // if (angle > 160) {
    //   imutableState.stage = "down";
    //   imutableState.counter += 1;
    // }
    // if (angle < 90 && angle > 60 && imutableState.stage == "down") {
    //   imutableState.stage = "up";
    //   imutableState.counter += 1;
    // }
    // setState(imutableState);
    let totalDistance = 0;
    let feedbackMessages = [];

    const correctionPoints = [
      "left_shoulder",
      "left_wrist",
      "left_elbow",
      "right_shoulder",
      "right_wrist",
      "right_elbow",
    ];
    for (let i = 0; i < userPose.length; i++) {
      const userPoint = userPose[i];
      if (correctionPoints.includes(userPoint.name)) {
        const referencePoint = referencePose[i];
        const distance = calculateDistance(userPoint, referencePoint);
        totalDistance += distance;
        if (currentStep === 1 ? distance >= 0.7 : distance >= 0.3) {
          // Adjust threshold as needed
          const direction = getDirection(userPoint, referencePoint);
          feedbackMessages.push(
            `Adjust ${referencePoint.name}: Move ${direction}`
          );
        }
      }
    }
    const averageDistance = totalDistance / correctionPoints.length;
    const isCorrect =
      currentStep === 1 ? averageDistance < 0.15 : averageDistance < 0.18; // Threshold for correctness

    const message = isCorrect ? ["Good job!"] : feedbackMessages;

    return { isCorrect, message };
  };

  const updateStepCounter = (isCorrect) => {
    if (isCorrect) {
      if (currentStep === 1) {
        console.log("Counter Incremented: ", stepCounter + 1);
        setStepCounter((prevState) => prevState + 1);
        setCurrentStep(0);
        return;
      }
      console.log("Step Incremented: ", currentStep + 1);

      setCurrentStep(currentStep + 1);
    }
  };

  const drawKeypointsAndSkeleton = (keypoints, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw keypoints
    keypoints.forEach(({ x, y, score }) => {
      if (score > 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // Draw skeleton
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
        ctx.strokeStyle = "green";
        ctx.stroke();
      }
    }
  };

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

              const poses = detector
                ? await detector?.estimatePoses(video)
                : [];
              if (poses && poses.length > 0) {
                const userPose = poses[0];
                const referencePose = getReferencePose(currentStep);
                const comparisonResult = comparePoses(userPose, referencePose);
                setFeedback(comparisonResult?.message ?? []);
                updateStepCounter(comparisonResult?.isCorrect);
                let keypoints = [...userPose.keypoints];
                const spinalPoints = estimateSpinalPoints(keypoints);
                keypoints = [...keypoints, ...spinalPoints];
                drawKeypointsAndSkeleton(keypoints, ctx);
              }
            }
          }
          requestAnimationFrame(detectPose);
        };
        detectPose();
      };
    }
  }, [detector, stream, referenceKeypoints]);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      await tf.setBackend("webgl"); // Set backend to WebGL

      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );
      setDetector(detector);
    };
    loadModel();
  }, []);

  return (
    <div className="html-video-player">
      <div style={{ position: "relative", maxWidth: "350px" }}>
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
          }}
          width="640"
          height="480"
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
          }}
          width="640"
          height="480"
        />
        <div style={{ position: "absolute", bottom: "-450px", left: 0 }}>
          <p>Step Counter: {stepCounter}</p>
          <p style={{ color: "red" }}>
            Feedback:{" "}
            {feedback && Array.isArray(feedback) && feedback.length
              ? feedback.map((item, index) => {
                  return (
                    <span key={index}>
                      {item} <br />
                    </span>
                  );
                })
              : JSON.stringify(feedback)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoseDetection;
