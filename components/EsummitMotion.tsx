"use client";

import React, { useEffect, useState } from 'react';
import EsummitMotionbg from '../assets/EsummitMotionbg.jpg';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden"
     style={{backgroundImage: `url(${EsummitMotionbg.src})`}}>
      {/* Content container that positions the animated content */}
      <div className="w-full h-full flex items-end pb-24">
        {/* Animated content that stops above black div */}
        <div
          className={`
            w-full bg-transparent p-8 rounded-t-lg shadow-lg
            transition-transform duration-[3000ms] ease-out
            ${isVisible ? 'translate-y-0' : 'translate-y-full'}
          `}
        >
          <div className="w-full flex flex-col items-center justify-center gap-6">
            <h2 className="text-2xl font-light tracking-[0.3em] text-white">
              ECELL VIT PRESENTS
            </h2>
            <h1 className="text-9xl font-extrabold tracking-widest text-white">
              E-SUMMIT’25
            </h1>
            <h2 className="text-xl font-light tracking-widest text-white">
              THE 8TH EDITION OF <span className="text-black font-light">THE BIGGEST FEST</span> IN SOUTH INDIA
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
