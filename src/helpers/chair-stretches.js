import referencePoses from "../constants/chair-stretches.json";

export const getReferencePose = (step) => {
  return (referencePoses && referencePoses.poses[step]) || null;
};
