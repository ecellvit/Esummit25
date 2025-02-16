// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { cn } from "@/utils/cn";

// export function LampDemo() {
//   return (
//     <LampContainer>
//       <motion.h1
//         initial={{ opacity: 0, y: 60 }}
//         whileInView={{ opacity: 0.8, y: 0 }}
//         transition={{
//           delay: 0.3,
//           duration: 1,
//           ease: "easeInOut",
//         }}
//         className="mt-8 bg-white py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-9xl"
//       >
//         E-SUMMIT '25
//       </motion.h1>
//     </LampContainer>
//   );
// }

// export const LampContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div
//       className={cn(
//         "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black w-full rounded-md z-0",
//         className
//       )}
//     >
//       <div className="relative flex w-full flex-1 -scale-150 items-center justify-center isolate z-0 ">
//         {/* Left gradient */}
//         <motion.div
//           initial={{ opacity: 0.5, width: "15rem" }}
//           whileInView={{ opacity: 1, width: "30rem" }}
//           transition={{
//             delay: 0.3,
//             duration: 1,
//             ease: "easeInOut",
//           }}
//           /* IMPORTANT: wrap gradient string in quotes */
//           style={{
//             backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
//           }}
//           className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem]
//                      bg-gradient-conic from-red-600 via-transparent to-transparent text-white
//                      [--conic-position:from_70deg_at_center_top]"
//         >
//           <div className="absolute w-full left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
//           <div className="absolute w-40 h-full left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
//         </motion.div>

//         {/* Right gradient */}
//         <motion.div
//           initial={{ opacity: 0.5, width: "15rem" }}
//           whileInView={{ opacity: 1, width: "30rem" }}
//           transition={{
//             delay: 0.3,
//             duration: 1,
//             ease: "easeInOut",
//           }}
//           /* IMPORTANT: wrap gradient string in quotes */
//           style={{
//             backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
//           }}
//           className="absolute inset-auto left-1/2 h-56 w-[30rem]
//                      bg-gradient-conic from-transparent via-transparent to-red-600 text-white
//                      [--conic-position:from_290deg_at_center_top]"
//         >
//           <div className="absolute w-40 h-full right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
//           <div className="absolute w-full right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
//         </motion.div>

//         {/* Central blur effects */}
//         <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl"></div>
//         <div className="absolute top-1/2 z-50 h-48 w-full bg-black opacity-10 backdrop-blur-md"></div>
//         <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl"></div>

//         {/* Cyan blur */}
//         <motion.div
//           initial={{ width: "8rem" }}
//           whileInView={{ width: "16rem" }}
//           transition={{
//             delay: 0.3,
//             duration: 1,
//             ease: "easeInOut",
//           }}
//           className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-gradient-to-r from-white to-orange-400 blur-2xl"
//         ></motion.div>

//         {/* Red horizontal bar */}
//         <motion.div
//           initial={{ width: "15rem" }}
//           whileInView={{ width: "30rem" }}
//           transition={{
//             delay: 0.3,
//             duration: 1,
//             ease: "easeInOut",
//           }}
//           className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-red"
//         ></motion.div>

//         {/* Black top bar */}
//         <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black"></div>
//       </div>

//       {/* Content container */}
//       <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
//         {children}
//       </div>
//     </div>
//   );
// };

"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
// import GodRays from "@/components/gif";
import { div } from "motion/react-client";
import Image from "next/image";
import rays from "@/assets/god-rays.gif";


export function LampDemo() {
  return (
    <div className="w-full top-10 h-full">
      <Image src={rays} alt="God Rays" layout="fit" objectFit="cover" className="absolute inset-0 z-10" />
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 0.8, y: -20 }}
          transition={{
            delay: 0.8,
            duration: 2,
            ease: "easeInOut",
          }}
          className="bg-white bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-9xl"
        >
          E-SUMMIT '25
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
            className="absolute right-1/2 h-56 w-[30rem] -scale-y-150
 bg-gradient-conic from-red-600 via-transparent to-transparent text-white [--conic-position:from_80deg_at_center_top]"
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
            className="absolute left-1/2 h-56 w-[30rem] -scale-y-150 bg-gradient-conic from-transparent via-transparent to-red-600 text-white [--conic-position:from_280deg_at_center_top]"
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
            className="absolute z-30 h-36 w-64  -translate-y-[-10rem] bg-gradient-to-r from-white to-orange-400 blur-2xl scale-x-[3] opacity-50"
          />
        </div>
      </div>

      {/* Foreground Content Container (Centered) */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5">
         {children}
      </div>
    </div>
  );
};


