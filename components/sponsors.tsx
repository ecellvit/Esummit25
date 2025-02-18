"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Sponsors: React.FC = () => {
  const sectionRef = useRef(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);
  return (
    <div>
    <section
      id="sponsor"
      ref={sectionRef}
      className="relative w-full h-[150vh] bg-[#510D0D] "
    >
      <div className="sticky top-0 left-0 w-full h-[50vh] flex flex-col items-center justify-center z-0 bg-gradient-to-b from-[#C72423] to-[#510D0D]">
        {/* Scrolling Marquee */}
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap ">
          <div className="flex w-max animate-speakersMarquee">
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-[BrigendsExpanded]  tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.28)",
                }}
              >
                SPONSORS &nbsp; SPONSORS &nbsp; SPONSORS
              </h1>
            ))}
          </div>
        </div>

        {/* Main Title */}
        <h1
          className="relative uppercase text-3xl md:text-6xl lg:text-7xl font-[BrigendsExpanded] text-center z-0 text-white"
        >
          SPONSORS
        </h1>
      </div>

      {/* Coming Soon Section */}
      <div
        ref={comingSoonRef}
        className="absolute top-[50vh] h-[100vh] w-full flex items-center justify-center rounded-t-3xl bg-white z-1"
      >
        <h1
          className="uppercase text-5xl md:text-6xl lg:text-7xl font-bold text-center font-[GreaterTheory]"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          COMING SOON!
        </h1>
      </div>
    </section>
    </div>
  );
};

export default Sponsors;