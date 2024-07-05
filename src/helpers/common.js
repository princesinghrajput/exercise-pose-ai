export function calculateAngle(a, b, c) {
  // Convert points into objects for clarity
  let A = { x: a.x, y: a.y };
  let B = { x: b.x, y: b.y };
  let C = { x: c.x, y: c.y };

  // Calculate the angles using Math.atan2
  let angleRad =
    Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angleDeg = Math.abs((angleRad * 180.0) / Math.PI);

  return 180 - angleDeg;
}

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
