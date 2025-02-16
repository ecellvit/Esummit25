"use client";
import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    if (isMobile) return; // Don't run cursor logic on mobile

    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.hasAttribute("onclick") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsClickable(true);
      } else {
        setIsClickable(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto"; // Reset cursor when component unmounts
    };
  }, [isMobile]);

  if (isMobile) return null; // Don't render cursor on mobile

  return (
    <div
      style={{
        position: "fixed",
        width: "35px",
        height: "30px",
        backgroundColor: "black",
        clipPath: isClickable ? "none" : "polygon(0% 0%, 100% 50%, 0% 100%, 20% 50%)",
        pointerEvents: "none",
        transform: "translate(-50%, -50%) rotate(-45deg)",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "transform 0.05s ease-out",
        zIndex: 9999,
        opacity: isClickable ? 0 : 1, 
      }}
    />
  );
};

export default CustomCursor;
