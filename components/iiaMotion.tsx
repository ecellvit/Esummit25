"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bg from "@/assets/Noise & Texture.png";

const getRandomChar = () => {
  const chars = 'QQWERTYUIO';
  return chars[Math.floor(Math.random() * chars.length)];
};

export default function IdeateComponent({ onComplete }: { onComplete: () => void }) {
  const texts = ["IDEATE.", "INNOVATE.", "ACTUATE."];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState(texts[0]);
  const [cycleCount, setCycleCount] = useState(0);
  const maxCycles = 1;
  const morphDuration = 100; // Duration for each letter to morph

  useEffect(() => {
    setTimeout(() => {
      onComplete();
    }, 3000);

    if (cycleCount >= maxCycles) return;

    const interval = setInterval(() => {
      const currentText = texts[currentTextIndex];
      const nextText = texts[(currentTextIndex + 1) % texts.length];
      let iterations = 0;
      
      // Morph each letter gradually
      const morphInterval = setInterval(() => {
        setDisplayText(prev => {
          return prev.split('').map((char, idx) => {
            // If we haven't reached the final iteration
            if (iterations < 3) {
              return getRandomChar();
            }
            // On final iteration, show the actual letter from next word
            return nextText[idx] || char;
          }).join('');
        });

        iterations++;
        
        // Stop morphing after a few iterations
        if (iterations >= 4) {
          clearInterval(morphInterval);
          setDisplayText(nextText);
        }
      }, morphDuration);

      setCurrentTextIndex(prev => {
        const newIndex = (prev + 1) % texts.length;
        if (newIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
        return newIndex;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cycleCount, currentTextIndex, onComplete]);

  if (cycleCount >= maxCycles) return null;

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full bg-black relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #1B1A19 100%, rgba(27, 26, 25, 0.00) 50%, #1B1A19 100%)",
      }}
    >
      <h1
        className="flex justify-center items-center z-10 text-red-800 text-[45px] md:text-[59.661px] lg:[59.661px] font-myCustom tracking-wide" >
        {displayText}
      </h1>

      <Image
        src={bg}
        alt="background"
        className="w-full h-full object-cover absolute top-0 left-0 z-10"
      />
    </div>
  );
}