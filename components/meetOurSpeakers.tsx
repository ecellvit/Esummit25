"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MeetOurSpeakers: React.FC = () => {
  const sectionRef = useRef(null);
  const marqueeRef = useRef(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin the entire section so that "Meet Our Speakers" remains static
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${comingSoonRef.current?.offsetHeight || 500}`,
        scrub: true,
        pin: true,
      });

      // Parallax effect for "COMING SOON"
      gsap.to(comingSoonRef.current, {
        y: "-100%", // Moves up to cover "Meet Our Speakers"
        ease: "none",
        scrollTrigger: {
          trigger: comingSoonRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden pb-32"
    >
      <div
        ref={marqueeRef}
        className="relative min-h-[30rem] w-full flex flex-col items-center justify-center pt-24 pb-40 mb-20"
      >
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
                MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS
              </h1>
            ))}
          </div>
        </div>

        <h1
          className="relative uppercase text-6xl md:text-6xl lg:text-8xl font-bold z-10 text-center mb-3 mt-[5rem]"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MEET OUR SPEAKERS
        </h1>
      </div>

      <div
        ref={comingSoonRef}
        className="min-h-screen w-full flex items-center justify-center rounded-t-3xl bg-gradient-to-b from-[#6F0F0F] via-[#C72423] via-38% to-[#510D0D] z-10"
      >
        <h1 className="uppercase text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center">
          COMING SOON!
        </h1>
      </div>
    </section>
  );
};

export default MeetOurSpeakers;
