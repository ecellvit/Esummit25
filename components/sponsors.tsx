"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s1 from "@/assets/sponsor1.svg";
import s2 from "@/assets/sponsor2.svg";
import s3 from "@/assets/sponsor3.svg";
import s4 from "@/assets/sponsor4.svg";
import s5 from "@/assets/sponsor5.svg";

gsap.registerPlugin(ScrollTrigger);

const Sponsors: React.FC = () => {
  const sectionRef = useRef(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);
  return (
    <section
      id="sponsor"
      ref={sectionRef}
      className="relative w-full h-[120vh] bg-[#510D0D] "
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
          className="relative uppercase text-3xl md:text-6xl lg:text-7xl font-[GreaterTheory] text-center z-0 text-white"
        >
          SPONSORS
        </h1>
      </div>

      {/* Coming Soon Section */}
      <div
        ref={comingSoonRef}
        className="absolute top-[50vh] min-h-[70vh] w-full flex items-center justify-center rounded-t-3xl bg-white z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-7 md:p-3 lg:p-0 w-[90%] mx-auto">
            {[s1, s2, s3, s4, s5].map((sponsor, index) => {
            const sponsorLinks = [
              "https://www.pizzahut.co.in",
              "https://bingosnacks.com",
              "https://jugnoo.io",
              "https://campusexpress.org.in",
              "http://www.ambalalrealestate.com"
            ];
            return (
              <Link key={index} href={sponsorLinks[index]} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center">
                <Image src={sponsor} alt={`Sponsor ${index + 1}`} className="w-full h-auto object-cover"/>
              </Link>
            );
            })}
        </div>
      </div>  
    </section>
  );
};

export default Sponsors;