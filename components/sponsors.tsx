"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Sponsors: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pin "SPONSORS" until "COMING SOON" fully covers it
      ScrollTrigger.create({
        trigger: sponsorsRef.current,
        start: "top top",
        end: () => `+=${comingSoonRef.current?.offsetHeight || 500}`,
        scrub: 1,
        pin: true,
      });

      // Parallax effect for "COMING SOON"
      gsap.to(comingSoonRef.current, {
        y: "-50%", // Moves up slowly for parallax effect
        ease: "none",
        scrollTrigger: {
          trigger: comingSoonRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 1,
        },
      });

      // Move "SPONSORS" up and disappear once covered
      gsap.to(sponsorsRef.current, {
        y: "-100%", // Moves up and out of view
        opacity: 0, // Fades out
        ease: "power2.out",
        scrollTrigger: {
          trigger: comingSoonRef.current,
          start: "top center",
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
      id="sponsors"
      className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Static SPONSORS Section (Orange Box) */}
      <div
        ref={sponsorsRef}
        className="relative min-h-[40rem] w-full flex items-center justify-center rounded-b-3xl bg-[#BA551B] z-10 overflow-hidden"
      >
        {/* Background Moving Text */}
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
                }}
              >
                SPONSORS &nbsp; SPONSORS &nbsp; SPONSORS &nbsp; SPONSORS
              </h1>
            ))}
          </div>
        </div>

        <h1 className="uppercase text-5xl md:text-6xl lg:text-7xl font-GreaterTheory font-bold text-white text-center relative z-10">
          SPONSORS
        </h1>
      </div>

      {/* White "COMING SOON!" Section (Scrolls Up and Covers Orange) */}
<div
  ref={comingSoonRef}
  className="relative min-h-[40rem] w-full flex items-center justify-center bg-white z-20 overflow-hidden"
>
  <h1 className="uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-[#E46B26] text-center">
    COMING SOON!
  </h1>
</div>

    </section>
  );
};

export default Sponsors;