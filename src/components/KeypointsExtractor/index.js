import React, { useEffect, useRef, useState } from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { calculateAngle, normalizeKeypoints } from "../../helpers/common";

const PoseDetection = () => {
  const [keypoints, setKeypoints] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [state, setState] = useState({
    loading: false,
  });
  useEffect(() => {
    const init = async () => {
      await tf.ready(); // Ensure TensorFlow.js is ready
      await tf.setBackend("webgl"); // Set backend to WebGL
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      setModel(detector);
      //   setLoading(false);
      setState({
        ...state,
        loading: false,
      });
    };
    setState({
      ...state,
      loading: true,
    });
    init();
  }, []);
  const loadModelAndDetectPose = async () => {
    const image = imageRef.current;
    const poses = await model.estimatePoses(image);

    if (poses.length > 0) {
      const normalizedKeypoint = normalizeKeypoints(
        poses[0].keypoints,
        image.width,
        image.height
      );
      setKeypoints(normalizedKeypoint);
      drawImageAndKeypoints(image, poses[0].keypoints, normalizedKeypoint);
    }
  };

  const drawImageAndKeypoints = (image, keypoints, normalizedKeypoint) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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

    // Calculate and draw angles at wrists and knees
    const drawAngle = (point1, point2, point3, canvasX, canvasY) => {
      if (point1.score > 0.5 && point2.score > 0.5 && point3.score > 0.5) {
        const angle = calculateAngle(point1, point2, point3).toFixed(1);
        ctx.beginPath();
        ctx.font = "16px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`${angle}°`, canvasX, canvasY);
      }
    };

    // Left wrist angle
    drawAngle(
      normalizedKeypoint[5],
      normalizedKeypoint[7],
      normalizedKeypoint[9],
      keypoints[7].x,
      keypoints[7].y
    );
    // Right wrist angle
    drawAngle(
      normalizedKeypoint[6],
      normalizedKeypoint[8],
      normalizedKeypoint[10],
      keypoints[8].x,
      keypoints[8].y
    );
    // Left knee angle
    drawAngle(
      normalizedKeypoint[11],
      normalizedKeypoint[13],
      normalizedKeypoint[15],
      keypoints[13].x,
      keypoints[13].y
    );
    // Right knee angle
    drawAngle(
      normalizedKeypoint[12],
      normalizedKeypoint[14],
      normalizedKeypoint[16],
      keypoints[14].x,
      keypoints[14].y
    );
  };

  return (
    <div>
      {state.loading ? (
        <p>Loading ...</p>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              imageRef.current = null;
              reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                  imageRef.current = img;
                  const canvas = canvasRef.current;
                  canvas.width = img.width;
                  canvas.height = img.height;
                  loadModelAndDetectPose();
                };
              };
              reader.readAsDataURL(file);
            }}
          />
          <div
            style={{
              display: "flex",
            }}
          >
            <canvas ref={canvasRef} />
            <textarea value={JSON.stringify(keypoints)} readOnly />
          </div>
        </>
      )}
    </div>
  );
};

export default PoseDetection;
