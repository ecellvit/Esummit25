"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import bg from '@/assets/Noise & Texture.png';
import "../../../globals.css";

export default function IdeateComponent() {
  const texts = ["IDEATE.", "INNOVATE.", "ACCUATE."];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full bg-black"
      style={{
        background: 'linear-gradient(180deg, #1B1A19 100%, rgba(27, 26, 25, 0.00) 50%, #1B1A19 100%)'
      }}>
      <h1
        className="text-animate"
        style={{
          opacity: currentTextIndex === 0 ? 1 : 0,
          animationDelay: '0s',
        }}
      >
        {texts[0]}
      </h1>
      <h1
        className="text-animate"
        style={{
          opacity: currentTextIndex === 1 ? 1 : 0,
          animationDelay: '3s',
        }}
      >
        {texts[1]}
      </h1>
      <h1
        className="text-animate"
        style={{
          opacity: currentTextIndex === 2 ? 1 : 0,
          animationDelay: '6s',
        }}
      >
        {texts[2]}
      </h1>
      <Image src={bg} alt="background" className="w-full h-full object-cover z-20" />
    </div>
  );
};
