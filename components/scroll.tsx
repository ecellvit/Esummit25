"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bg from "/assets/scrollBg.svg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Animation: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const words = ["AN ENTREPRENEUR", "WORKING WITH STARTUPS", "INTERESTED IN STARTUPS"];

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

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        onComplete: () => {
          setIndex((prev) => (prev + 1) % words.length);
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100vh] bg-white flex flex-col items-center justify-center text-black text-4xl font-[GreaterTheory]"
      id="scroll"
    >
      <Image src={bg} alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" />
      <div className="text-center font-bold z-10">THIS EVENT IS FOR YOU IF YOU ARE</div>
      <div
        ref={textRef}
        className="text-center mt-5 font-light z-10"
        style={{
          background:
            "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {words[index]}
      </div>
    </section>
  );
};

export default Animation;