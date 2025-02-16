"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Schedule: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const section = sectionRef.current;
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom bottom",
      anticipatePin: 1,
      onLeave: () => {
        window.scrollTo({
          top: document.getElementById("timeline")?.offsetTop,
          behavior: "smooth",
        });
      },
    });
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[50vh] bg-white"
    >
      <div className="sticky top-0 left-0 w-full h-[50vh] flex flex-col items-center justify-center z-0 bg-white">
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-speakersMarquee">
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(176, 81, 25, 0.22)",
                }}
              >
                SCHEDULE &nbsp; SCHEDULE &nbsp; SCHEDULE
              </h1>
            ))}
          </div>
        </div>

        <h1
          className="relative uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-center z-0"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SCHEDULE
        </h1>
      </div>
    </section>
  );
};

export default Schedule;