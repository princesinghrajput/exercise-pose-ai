import React, { useRef, useEffect } from "react";

const CameraFeed = ({ onStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getUserMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      onStream(stream);
    };
    getUserMedia();
  }, [onStream]);

  return (
    <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
  );
};

export default CameraFeed;
