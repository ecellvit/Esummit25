"use client";

import { useEffect, useState } from "react";
import { FaFacebook, FaXTwitter, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa6";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export default function Footer() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const clockLabels = "ENTREPRENEUR".split("");

  return (
    <footer className="text-black w-full bg-white shadow-md" id="footer">
      <div className="flex items-center justify-evenly">
        <div className="flex-col space-y-1 text-lg h-[11vw] pt-[5vw] justify-center items-center hidden md:flex">
          <a href="https://www.linkedin.com/company/ecellvitvellore" className="hover:text-gray-500"><FaLinkedin size={20} /></a>
          <a href="https://www.instagram.com/ecell_vit" className="hover:text-gray-500"><FaInstagram size={20} /></a>
          <a href="https://twitter.com/ecell_vit" className="hover:text-gray-500"><FaXTwitter size={20} /></a>
          <a href="https://www.facebook.com/ecellvit" className="hover:text-gray-500"><FaFacebook size={20} /></a>
        </div>
        <h1 className="text-[11vw] font-black tracking-widest flex">
          {["E", "-", "S", "U", "M", "M", "I", "T", "'", "2", "5"].map((char, index) => (
            <div 
              key={index}
              className="inline-block h-[12vw] items-end transition-all duration-400 hover:font-light"
           
            >
              {char}
            </div>
          ))}
        </h1>
      </div>
      <div className="flex items-center bg-black text-gray-400 text-lg py-4 mt-0 relative overflow-hidden">
        <div className="w-3/3 md:w-2/3 overflow-hidden whitespace-nowrap">
          <div className="animate-scroll flex">
            {Array(10).fill("#WeBreedBusiness").map((text, index) => (
              <span key={index} className="text-lg font-medium mr-10">
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="w-1/3 text-center font-bold hidden md:block">
          &copy; 2025, <span className="font-bold">Entrepreneurship Cell VIT</span>
        </div>
      </div>
      <div className="text-center bg-black text-gray-400 pb-4 font-bold md:hidden">
          &copy; 2025, <span className="font-bold">Entrepreneurship Cell VIT</span>
      </div>
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          white-space: nowrap;
          animation: scroll 10s linear infinite;
          width: max-content;
        }
      `}</style>
    </footer>
  );
}