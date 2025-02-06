"use client";
import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
    
      style={{
        position: "fixed",
        width: "35px", 
        height: "30px",
        backgroundColor: "black", 
        clipPath: "polygon(0% 0%, 100% 50%, 0% 100%, 20% 50%)", 
        pointerEvents: "none",
        transform: "translate(-50%, -50%) rotate(-45deg)", 
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "transform 0.05s ease-out",
        zIndex: 9999,
      }}
    />
  );
};

export default CustomCursor;
