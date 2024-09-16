import React from "react";
import { Link } from "react-router-dom";
import DemoVideoThumbnail from "../../src/demo-poses/chair-sitting-exercise/stage-1.png";
import FrozenExerciseThumbnail from "../../src/demo-poses/frozen-shoulder-exercise/stage-1.png";
import PushUpThumbnail from "../../src/demo-poses/push-up/push-r-1.png";
import "./ExercisePage.css";

const ExercisePage = () => {
  const exercises = [
    {
      id: "1",
      name: "Chair Stretches",
      description: "Stretch your back and shoulders with simple chair exercises.",
      thumbnail: DemoVideoThumbnail,
    },
    {
      id: "2",
      name: "Frozen Shoulder Exercise",
      description: "Loosen your frozen shoulder with these guided movements.",
      thumbnail: FrozenExerciseThumbnail,
    },
    {
      id: "3",
      name: "Push-Ups",
      description: "Improve upper body strength with classic push-ups.",
      thumbnail: PushUpThumbnail,
    },
  ];

  return (
    <div className="exercise-page-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Welcome to Your Personalized Workout</h1>
        <p className="hero-subtitle">Choose an exercise to get started!</p>
      </header>

      {/* Exercise Cards */}
      <div className="exercise-card-grid">
        {exercises.map((exercise) => (
          <Link to={`/exercise/${exercise.id}`} className="exercise-card" key={exercise.id}>
            <img
              src={exercise.thumbnail}
              alt={`${exercise.name} thumbnail`}
              className="exercise-card-thumbnail"
            />
            <div className="exercise-card-content">
              <h2 className="exercise-card-title">{exercise.name}</h2>
              <p className="exercise-card-description">{exercise.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;
