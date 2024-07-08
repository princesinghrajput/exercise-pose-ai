export const estimateSpinalPoints = (keypoints) => {
  const getMidpoint = (point1, point2) => {
    if (!point1 || !point2) return null;
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
      score: (point1.score + point2.score) / 2,
      name: "spine",
    };
  };

  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];

  const upperSpine = getMidpoint(leftShoulder, rightShoulder);
  if (upperSpine) upperSpine.name = "upper_spine";

  const lowerSpine = getMidpoint(leftHip, rightHip);
  if (lowerSpine) lowerSpine.name = "lower_spine";

  const midSpine = getMidpoint(upperSpine, lowerSpine);
  if (midSpine) midSpine.name = "mid_spine";

  return [upperSpine, midSpine, lowerSpine].filter((point) => point !== null);
};
