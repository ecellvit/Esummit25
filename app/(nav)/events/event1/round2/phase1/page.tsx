"use client";
import React from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";

export default function Testing() {
  return (
    <div
      className="relative w-full h-full min-h-screen"
      style={{
        background:
          "radial-gradient(63.7% 63.7% at 50% 50%, #35C0FB 0%, #126E9D 100%)",
      }}
    >
      {/* Center Island (slightly off-center) */}
      <Image
        src={island0}
        alt="island0"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 w-auto h-64 object-cover z-10 animate-float"
        priority
      />

      {/* Corner Islands (asymmetrical positioning) */}
      <Image
        src={island1}
        alt="island1"
        className="absolute top-16 left-20 w-auto h-48 object-cover z-10 animate-float-slow"
        priority
      />
      <Image
        src={island2}
        alt="island2"
        className="absolute top-28 right-48  w-auto h-48 object-cover z-10 animate-float-fast"
        priority
      />
      <Image
        src={island3}
        alt="island3"
        className="absolute bottom-20 left-60 w-auto h-48 object-cover z-10 animate-float-slow"
        priority
      />
      <Image
        src={island4}
        alt="island4"
        className="absolute bottom-12 right-44 w-auto h-48 object-cover z-10 animate-float-fast"
        priority
      />

      {/* Broken Lines (paths between islands) */}
      <svg className="absolute inset-0 w-full h-full z-0">
        <line
          x1="50%"
          y1="50%"
          x2="15%"
          y2="20%"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="50%"
          y1="50%"
          x2="85%"
          y2="25%"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="50%"
          y1="50%"
          x2="20%"
          y2="75%"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <line
          x1="50%"
          y1="50%"
          x2="80%"
          y2="85%"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes float-fast {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
