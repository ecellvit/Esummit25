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
    if (comingSoonRef.current) {
      const handleScroll = (event: WheelEvent) => {
        if (event.deltaY > 20) {
          window.scrollTo({
            top: document.getElementById("timeline")?.offsetTop,
            behavior: "smooth",
          });
      };
    }
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
    }
  
    let ctx = gsap.context(() => {
      // Keep "SPONSORS" pinned in place initially
      ScrollTrigger.create({
        trigger: sponsorsRef.current,
        start: "top top",
        end: () => `+=${comingSoonRef.current?.offsetHeight || 500}`,
        pin: true,
        scrub: true,
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
  
      // Move "SPONSORS" up slightly later, so it stays visible longer
      gsap.to(sponsorsRef.current, {
        y: "-100%", // Moves up and disappears
        ease: "power2.out",
        scrollTrigger: {
          trigger: comingSoonRef.current,
          start: "top 40%", // DELAYED START: Wait until "COMING SOON" moves further up
          end: "top 10%", // Moves out smoothly as "COMING SOON" goes up
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
  className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden mt-[-70rem] " // Set margin-top to 0
>
  <div
    ref={sponsorsRef}
    className="min-h-[40rem] w-full flex items-center justify-center rounded-b-3xl bg-gradient-to-b from-[#6F0F0F] via-[#C72423] via-38% to-[#510D0D] z-10 mb-0" // Set margin-bottom to 0
  >
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

  <div
    ref={comingSoonRef}
    className="relative min-h-[40rem] w-full flex items-center justify-center bg-white z-20 overflow-hidden"
  >
    <h1
      className="uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-center"
      style={{
        background: "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      COMING SOON!
    </h1>
  </div>
</section>

  );
};

export default Sponsors;