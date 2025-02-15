"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img0 from "/assets/image (1).jpg";
import img1 from "/assets/image (1).jpg";
import img2 from "/assets/image (2).jpg";
import img3 from "/assets/image (3).jpg";
import img4 from "/assets/image (4).jpg";
import img5 from "/assets/image (5).jpg";
import img6 from "/assets/image (6).jpg";
import logo from "/assets/fpback.svg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const events = [
  {
    name: "INNOVENTURE",
    date: "March 4",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "E TALK",
    date: "March 5",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "MARKETING WORKSHOP",
    date: "March 6",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "ACHIEVERS CONCLAVE",
    date: "March 6",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "IDEATHON",
    date: "March 7",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const images = [img0, img1, img2, img3, img4, img5, img6];

export default function Schedule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const scrollThreshold = 40;
  const containerRef = useRef(null);

  const dateRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const newImageRef = useRef(null);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault();
      setScrollDelta((prevDelta) => prevDelta + event.deltaY);

      if (Math.abs(scrollDelta) >= scrollThreshold) {
        if (event.deltaY > 0 && activeIndex < events.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else if (event.deltaY < 0 && activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
        setScrollDelta(0);
      }
    };
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [activeIndex, scrollDelta]);

  useEffect(() => {
    gsap.to(containerRef.current.children, {
      y: "-=100%",
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.1,
    });
  }, [activeIndex]);

  const gradientStyle = "linear-gradient(180deg, #6F0F0F 3.67%, #C72423 38.67%, #981B1B 65.67%, #510D0D 100%)";

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-2/3 flex flex-col p-10 relative">
        {/* Navigation Bar */}
        <div className="relative">
          <h2 className="text-7xl font-bold my-6" style={{ background: gradientStyle, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SCHEDULE</h2>
          <div className="absolute left-1 bottom-1 w-2 bg-gray-300 h-[55%]"></div>
          <ul className="space-y-2 relative">
            {events.map((event, idx) => (
              <li key={idx} className="relative flex items-center cursor-pointer text-xl">
                {activeIndex === idx && (
                  <div
                    className="absolute left-0 w-4 h-full"
                    style={{ background: gradientStyle }}
                    onClick={() => setActiveIndex(idx)}
                  ></div>
                )}
                <span
                  className={`pl-8 ${activeIndex === idx ? "text-black font-bold" : "text-gray-400 hover:text-black"}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  {event.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Details */}
        <div className="flex flex-col items-start mt-16 gap-4">
          <p ref={dateRef} className="text-3xl font-black text-black">
            {events[activeIndex].date}
          </p>
          <h3 ref={nameRef} className="text-7xl font-bold" style={{ background: gradientStyle, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {events[activeIndex].name}
          </h3>
          <p ref={descriptionRef} className="text-lg text-gray-700">
            {events[activeIndex].description}
          </p>
          <button
            className="text-white px-8 py-4 mt-4 border-[#D22121] border-solid border-4 rounded-md text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
            style={{ background: gradientStyle }}
          >
            REGISTER NOW
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/3 relative overflow-hidden" style={{ height: "80vh" }}>
        <div ref={containerRef} className="absolute top-0 left-0 w-full h-full flex flex-col transition-transform duration-500">
          {images.map((image, idx) => (
            <div key={idx} className={`relative w-full h-1/3 flex justify-center ${idx === activeIndex ? "opacity-100 scale-105" : "opacity-60"}`}>
              <Image src={image} alt={`Event ${idx + 1}`} layout="fill" objectFit="cover" className="transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
