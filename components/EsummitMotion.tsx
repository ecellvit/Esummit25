"use client";

import React, { useEffect, useState } from 'react';
import EsummitMotionbg from '../assets/EsummitMotionbg.jpg';

const EsummitMotion = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen w-full relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: `url(${EsummitMotionbg.src})`}}
    >
      {/* Content container with absolute positioning */}
      <div className="w-full h-full">
        {/* Black bottom div */}
        <div className="absolute bottom-0 left-0 right-0 h-54 lg:h-44 bg-black z-40 " />
        
        {/* Animated content */}
        <div
          className={`
            absolute top-[35%] left-0 right-0
            w-full bg-transparent p-4 md:p-8 rounded-t-lg
            transition-all duration-[3000ms] ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[70vh] opacity-0'}
          `}
        >
          <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-6">
            <h2 className="text-lg md:text-2xl font-light tracking-[0.2em] md:tracking-[0.3em] text-white text-center">
              ECELL VIT PRESENTS
            </h2>
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-extrabold tracking-wider md:tracking-widest text-white text-center">
              E-SUMMIT&apos;25
            </h1>
            <h2 className="text-[10px] sm:text-sm md:text-xl font-light tracking-wider md:tracking-widest text-white text-center whitespace-nowrap px-2">
              THE 8TH EDITION OF{' '}
              <span className="text-black font-light">THE BIGGEST FEST</span>
              {' '}IN SOUTH INDIA
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsummitMotion;