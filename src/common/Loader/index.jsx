import React from "react";
import "./loader.css";
import { LifeLine } from "react-loading-indicators";
const Loader = () => {
  return (
    <div className="loader-container">
      <LifeLine color="#32cd32" size="medium" text="" textColor="" />
      <p style={{ fontSize: "14px", textAlign: "center" }}>Loading...</p>
    </div>
  );
};

export default Loader;
