"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { div } from "motion/react-client";
import Image from "next/image";
import rays from "@/assets/god-rays.gif";
import CountdownTimer from "../counter";
import RegisterBtn from "@/components/registernowButton";
import EsummitHeroText from "../Esummitherotext";


export function LampDemo() {
  return (
    <div
      className="w-full font-[BrigendsExpanded]"
      id="home"
    >
      <video
        src={rays.src} // Use .src if necessary, or just rays if it's already a string
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full min-h-screen object-cover z-80"
      />
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 0.8, y: -20 }}
          transition={{
            delay: 0.8,
            duration: 2,
            ease: "easeInOut",
          }}
          className="bg-white bg-clip-text text-center font-medium tracking-tight text-transparent "
        >
          <EsummitHeroText />
        </motion.h1>
      </LampContainer>
    </div>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-black overflow-hidden z-0",
        className
      )}
    >
      {/* Background Effects Container */}
      <div className="absolute inset-0 z-0">
        <div className="relative flex h-full w-full items-center justify-center isolate">
          {/* Left gradient */}
          <motion.div
            initial={{ opacity: 0.5, width: "25rem" }}
            whileInView={{ opacity: 1, width: "60rem" }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage:
                "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
            }}
            className="absolute right-[49.9999%] bottom-[60vh] h-[120vh] w-[30 rem] -scale-y-150
 bg-gradient-conic from-red-600 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            {/* Mask divs */}
            <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-black [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-black [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>

          {/* Right gradient */}
          <motion.div
            initial={{ opacity: 0.5, width: "25rem" }}
            whileInView={{ opacity: 1, width: "60rem" }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage:
                "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
            }}
            className="absolute left-1/2 bottom-[60vh] h-[120vh] w-[30rem] -scale-y-150 bg-gradient-conic from-transparent via-transparent to-red-600 text-white [--conic-position:from_290deg_at_center_top]"
          >
            {/* Mask divs */}
            <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-black [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-black [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>

          {/* Red blurred circle in center */}
          <div className="absolute z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl scale-y-[2]"></div>

          {/* Cyan blur */}
          <motion.div
            initial={{ width: "8rem" }}
            whileInView={{ width: "16rem" }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: "easeInOut",
            }}
            className="absolute z-30 h-36 w-64 top-[35vh] -translate-y-[-10rem] bg-gradient-to-r from-white to-orange-400 blur-xl scale-x-[3] opacity-50"
          />
        </div>
      </div>

      {/* Foreground Content Container (Centered) */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5">
        {children}
      </div>
      <div className="flex justify-center items-center absolute bottom-[150px] w-full">
      <RegisterBtn/>
      </div>
      <div className="flex w-full justify-center absolute bottom-[30px] items-center">
      <CountdownTimer targetDate="2025-03-04T00:00:00"/>
      </div>
    </div>
  );
};




