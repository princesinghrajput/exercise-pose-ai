import referencePoses from "../constants/chair-stretches.json";
import demoPoses from "../constants/demos.json";

export const getReferencePose = (step) => {
  return (referencePoses && referencePoses.poses[step]) || null;
};

export const getExercisePosesAndAngles = (name) => {
  return demoPoses[name];
};
