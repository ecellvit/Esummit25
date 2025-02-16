// GodRays.tsx
import React from "react";
import videoSrc from "@/assets/rays.mp4";

const GodRays: React.FC = () => {
  return (
    <video
      src={videoSrc.src}
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
};

export default GodRays;
