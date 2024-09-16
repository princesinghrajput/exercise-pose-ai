export const calculateAngle = (p1, p2, p3) => {
  const vector1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const vector2 = { x: p3.x - p2.x, y: p3.y - p2.y };

  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
  const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

  let angle =
    Math.acos(dotProduct / (magnitude1 * magnitude2)) * (180 / Math.PI);

  if (isNaN(angle)) {
    angle = 0;
  }

  return angle;
};

export const handleComparison = (keypoints) => {
  try {
    let leftShoulder = keypoints.find((k) => k.name === "left_shoulder");
    let leftWrist = keypoints.find((k) => k.name === "left_wrist");
    let leftElbow = keypoints.find((k) => k.name === "left_elbow");
    if (!leftElbow || !leftShoulder || !leftWrist) {
      console.error("Missing keypoints for comparison:", {
        leftElbow,
        leftShoulder,
        leftWrist,
      });
      return -1; // Indicate invalid angle
    }
    let angle = calculateAngle(leftElbow, leftWrist, leftShoulder);
    console.log("Angle: ", angle);
    return angle;
  } catch (error) {
    console.log("Error while comparison: ", error);
    return 0;
  }
};

export const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

export const getDirection = (userPoint, referencePoint) => {
  let direction = "";
  if (userPoint.y < referencePoint.y) {
    direction += "down";
  } else if (userPoint.y > referencePoint.y) {
    direction += "up";
  }
  if (userPoint.x < referencePoint.x) {
    direction += direction ? "-left" : "left";
  } else if (userPoint.x > referencePoint.x) {
    direction += direction ? "-right" : "right";
  }
  return direction;
};

export const normalizeKeypoints = (keypoints, height, width) => {
  return keypoints.map((kp) => ({
    ...kp,
    x: kp.x / width,
    y: kp.y / height,
  }));
};

export const fetchMajorAngles = (keypoints) => {
  const left_wrist_angle = calculateAngle(
    findKeypoint(keypoints, "left_shoulder"),
    findKeypoint(keypoints, "left_elbow"),
    findKeypoint(keypoints, "left_wrist")
  );
  const right_wrist_angle = calculateAngle(
    findKeypoint(keypoints, "right_shoulder"),
    findKeypoint(keypoints, "right_elbow"),
    findKeypoint(keypoints, "right_wrist")
  );
  const left_knee_angle = calculateAngle(
    findKeypoint(keypoints, "left_hip"),
    findKeypoint(keypoints, "left_knee"),
    findKeypoint(keypoints, "left_ankle")
  );
  const right_knee_angle = calculateAngle(
    findKeypoint(keypoints, "right_hip"),
    findKeypoint(keypoints, "right_knee"),
    findKeypoint(keypoints, "right_ankle")
  );
  const left_shoulder_angle = calculateAngle(
    findKeypoint(keypoints, "left_hip"),
    findKeypoint(keypoints, "left_shoulder"),
    findKeypoint(keypoints, "left_elbow")
  );
  const right_shoulder_angle = calculateAngle(
    findKeypoint(keypoints, "right_hip"),
    findKeypoint(keypoints, "right_shoulder"),
    findKeypoint(keypoints, "right_elbow")
  );

  return [
    left_wrist_angle,
    right_wrist_angle,
    left_knee_angle,
    right_knee_angle,
    left_shoulder_angle,
    right_shoulder_angle,
  ];
};

export const findKeypoint = (keypoints, name) =>
  keypoints.find((kp) => kp.name === name);

export const evaluateCondition = (angle, operator, value) => {
  switch (operator) {
    case "<":
      return angle < value;
    case ">":
      return angle > value;
    case "==":
      return angle == value;
    default:
      return false;
  }
};
