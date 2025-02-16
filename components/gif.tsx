// GodRays.tsx
import React from "react";
import videoSrc from "@/assets/god-rays.gif";

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
