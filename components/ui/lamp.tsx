// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { cn } from "@/utils/cn";
// import { div } from "motion/react-client";
// import Image from "next/image";
// import rays from "@/assets/god-rays.gif";
// import CountdownTimer from "../counter";
// import RegisterBtn from "@/components/registernowButton";
// import EsummitHeroText from "../Esummitherotext";


// // export function LampDemo() {
// //   return (
// //     <div
// //       className="w-full font-[BrigendsExpanded]"
// //       id="home"
// //     >
// //       <video
// //         src={rays.src} // Use .src if necessary, or just rays if it's already a string
// //         autoPlay
// //         loop
// //         muted
// //         playsInline
// //         className="absolute inset-0 w-full min-h-screen object-cover z-80"
// //       />
// //       <LampContainer>
// //         <motion.h1
// //           initial={{ opacity: 0, y: 80 }}
// //           whileInView={{ opacity: 0.8, y: -20 }}
// //           transition={{
// //             delay: 0.8,
// //             duration: 2,
// //             ease: "easeInOut",
// //           }}
// //           className="bg-white bg-clip-text text-center font-medium tracking-tight text-transparent "
// //         >
// //           <EsummitHeroText />
// //         </motion.h1>
// //       </LampContainer>
// //     </div>
// //   );
// // }

// // export const LampContainer = ({
// //   children,
// //   className,
// // }: {
// //   children: React.ReactNode;
// //   className?: string;
// // }) => {
// //   return (
// //     <div
// //       className={cn(
// //         "relative w-[100vw] min-h-screen bg-[#1E1B1A] overflow-hidden z-0",
// //         className
// //       )}
// //     >
// //       {/* Background Effects Container */}
// //       <div className="absolute inset-0 z-0">
// //         <div className="relative flex h-full  items-center justify-center isolate">
// //           {/* Left gradient */}
// //           <motion.div
// //             initial={{ opacity: 0.5, width: "25rem" }}
// //             whileInView={{ opacity: 1, width: "60rem" }}
// //             transition={{
// //               delay: 0.3,
// //               duration: 1,
// //               ease: "easeInOut",
// //             }}
// //             style={{
// //               backgroundImage:
// //                 "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
// //             }}
// //             className="absolute right-[49.9999%] bottom-[65vh] h-[120vh] w-[30 rem] -scale-y-150
// //  bg-gradient-conic from-red-600 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
// //           >
// //             {/* Mask divs */}
// //             <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-[#1E1B1A] [mask-image:linear-gradient(to_top,white,transparent)]" />
// //             <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-[#1E1B1A] [mask-image:linear-gradient(to_right,white,transparent)]" />
// //           </motion.div>

// //           {/* Right gradient */}
// //           <motion.div
// //             initial={{ opacity: 0.5, width: "25rem" }}
// //             whileInView={{ opacity: 1, width: "60rem" }}
// //             transition={{
// //               delay: 0.3,
// //               duration: 1,
// //               ease: "easeInOut",
// //             }}
// //             style={{
// //               backgroundImage:
// //                 "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
// //             }}
// //             className="absolute left-1/2 bottom-[65vh] h-[120vh] w-[30rem] -scale-y-150 bg-gradient-conic from-transparent via-transparent to-red-600 text-white [--conic-position:from_290deg_at_center_top]"
// //           >
// //             {/* Mask divs */}
// //             <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-[#1E1B1A] [mask-image:linear-gradient(to_left,white,transparent)]" />
// //             <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-[#1E1B1A] [mask-image:linear-gradient(to_top,white,transparent)]" />
// //           </motion.div>

// //           {/* Red blurred circle in center */}
// //           <div className="absolute z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl scale-y-[2]"></div>

// //           {/* Cyan blur */}
// //           <motion.div
// //             initial={{ width: "8rem" }}
// //             whileInView={{ width: "16rem" }}
// //             transition={{
// //               delay: 0.3,
// //               duration: 1,
// //               ease: "easeInOut",
// //             }}
// //             className="absolute z-30 h-36 w-64 top-[25vh] -translate-y-[-10rem] bg-gradient-to-r from-white to-orange-400 blur-xl scale-x-[3] opacity-50"
// //           />
// //         </div>
// //       </div>

// //       {/* Foreground Content Container (Centered) */}
// //       <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5">
// //         {children}
// //       </div>
// //       <div className="flex justify-center items-center absolute bottom-[150px] w-full">
// //       <RegisterBtn/>
// //       </div>
// //       <div className="flex w-full justify-center absolute bottom-[30px] items-center">
// //       <CountdownTimer targetDate="2025-03-04T00:00:00"/>
// //       </div>
// //     </div>
// //   );
// // };

// // "use client";
// // import React from "react";
// // import { motion } from "framer-motion";
// // import { cn } from "@/utils/cn";
// // import { div } from "motion/react-client";
// // import Image from "next/image";
// // import rays from "@/assets/god-rays.gif";
// // import CountdownTimer from "../counter";
// // import RegisterBtn from "@/components/registernowButton";
// // import EsummitHeroText from "../Esummitherotext";

// export function LampDemo() {
//   return (
//     <div className="w-full font-[BrigendsExpanded]" id="home">
     

//       <LampContainer>
//         <motion.h1
//           initial={{ opacity: 0, y: 80 }}
//           whileInView={{ opacity: 0.8, y: -20 }}
//           transition={{
//             delay: 0.8,
//             duration: 2,
//             ease: "easeInOut",
//           }}
//           className="bg-white bg-clip-text text-center font-medium tracking-tight text-transparent"
//         >
//           <EsummitHeroText />
//         </motion.h1>
//       </LampContainer>
//     </div>
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
//         "relative w-full h-screen bg-[#1E1B1A] overflow-hidden z-0 flex flex-col justify-between",
//         className
//       )}

//     >
//       {/* Background Effects Container */}
//       <div className="absolute inset-0 z-0">
//         <div className="relative flex h-full items-center justify-center isolate">
//           {/* Left gradient */}
//           <motion.div
//             initial={{ opacity: 0.5, width: "25rem" }}
//             whileInView={{ opacity: 1, width: "60rem" }}
//             transition={{
//               delay: 0.3,
//               duration: 1,
//               ease: "easeInOut",
//             }}
//             style={{
//               backgroundImage:
//                 "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
//             }}
//             className="absolute right-[49.9999%] bottom-[65vh] h-[120vh] w-[5vw] -scale-y-150 bg-gradient-conic from-red-600 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] sm:w-[25rem] sm:h-[80vh] sm:bottom-[60vh]"
//           >
//             {/* Mask divs */}
//             <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-[#1E1B1A] [mask-image:linear-gradient(to_top,white,transparent)]" />
//             <div className="absolute bottom-0 left-0 z-20 h-full w-40  bg-[#1E1B1A] [mask-image:linear-gradient(to_right,white,transparent)]" />
//           </motion.div>

//           {/* Right gradient */}
//           <motion.div
//             initial={{ opacity: 0.5, width: "25rem" }}
//             whileInView={{ opacity: 1, width: "60rem" }}
//             transition={{
//               delay: 0.3,
//               duration: 1,
//               ease: "easeInOut",
//             }}
//             style={{
//               backgroundImage:
//                 "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
//             }}
//             className="absolute left-1/2 bottom-[65vh] h-[120vh] w-[30rem] -scale-y-150 bg-gradient-conic from-transparent via-transparent to-red-600 text-white [--conic-position:from_290deg_at_center_top] sm:w-[20rem] sm:h-[80vh] sm:bottom-[60vh]"
//           >
//             {/* Mask divs */}
//             <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-[#1E1B1A] [mask-image:linear-gradient(to_left,white,transparent)]" />
//             <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-[#1E1B1A] [mask-image:linear-gradient(to_top,white,transparent)]" />
//           </motion.div>

//           {/* Red blurred circle in center */}
//           <div className="absolute z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl scale-y-[2] sm:w-[20rem] sm:h-[20rem]" />

//           {/* Cyan blur */}
//           <motion.div
//             initial={{ width: "8rem" }}
//             whileInView={{ width: "16rem" }}
//             transition={{
//               delay: 0.3,
//               duration: 1,
//               ease: "easeInOut",
//             }}
//             className="absolute z-30 h-36 w-64 top-[25vh] -translate-y-[-10rem] bg-gradient-to-r from-white to-orange-400 blur-xl scale-x-[3] opacity-50 sm:w-40 sm:h-24 sm:top-[15vh]"
//           />
//         </div>
//       </div>

//       {/* Foreground Content Container (Centered) */}
//       <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 overflow-x-hidden">

//         {children}
//       </div>

//       {/* Register Button */}
//       <div className="flex justify-center items-center absolute bottom-[30vh] w-full sm:bottom-[100px]">
//         <RegisterBtn />
//       </div>

//       {/* Countdown Timer */}
//       <div className="flex w-full justify-center absolute bottom-[10vh] items-center sm:bottom-[20px]">
//         <CountdownTimer targetDate="2025-03-04T00:00:00" />
//       </div>
//     </div>
//   );
// };

"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Image from "next/image";
import CountdownTimer from "../counter";
import RegisterBtn from "@/components/registernowButton";
import EsummitHeroText from "../Esummitherotext";
import text from "@/assets/maintext.svg";
import text1 from "@/assets/Variant3.svg"
import logo from "@/assets/herosectionlogo.svg";

export function LampDemo() {
  return (
    <div className="w-full font-[BrigendsExpanded]" id="home">
      <LampContainer>
        <div className="hidden md:block">       
          <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 0.8, y: -20 }}
          transition={{
            delay: 0.8,
            duration: 2,
            ease: "easeInOut",
          }}
          className="bg-white bg-clip-text text-center font-medium tracking-tight text-transparent"
        >
          <Image src={text1} alt="esummit text" />
        </motion.h1>
        </div>
        <div className="block md:hidden">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 0.8, y: -20 }}
          transition={{
            delay: 0.8,
            duration: 2,
            ease: "easeInOut",
          }}
          className="bg-white bg-clip-text text-center font-medium tracking-tight text-transparent"
        >
          <div className="justify-items-center p-5 "><Image src={logo} alt="esummit logo"/></div>
          <Image src={text} alt="esummit text"  />
        </motion.h1>
        </div>
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
        "relative  min-h-screen w-full bg-[#1E1B1A] overflow-hidden z-0",
        className
      )}
    >
      <div className="hidden md:block">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="relative flex h-full items-center justify-center isolate">
          {/* Left gradient */}
          <motion.div
            initial={{ opacity: 0.5, width: "10vw" }}
            whileInView={{ opacity: 1, width: "60vw" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
            }}
            className="absolute right-[50%] bottom-[65vh] h-[120vh] w-[10vw] -scale-y-150 
            bg-gradient-conic from-red-600 via-transparent to-transparent text-white 
            [--conic-position:from_70deg_at_center_top] 
            sm:w-[20vw] sm:h-[80vh] sm:bottom-[60vh] 
            md:w-[25rem] md:h-[70vh] md:bottom-[50vh]"
          >
            {/* Mask divs */}
            <div
              className="absolute bottom-0 left-0 z-20 h-40 w-full bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_top,white,transparent)]"
            />
            <div
              className="absolute bottom-0 left-0 z-20 h-full w-40 bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_right,white,transparent)]"
            />
          </motion.div>

          {/* Right gradient */}
          <motion.div
            initial={{ opacity: 0.5, width: "10vw" }}
            whileInView={{ opacity: 1, width: "60vw" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
            }}
            className="absolute left-1/2 bottom-[65vh] h-[120vh] w-[10vw] -scale-y-150 
            bg-gradient-conic from-transparent via-transparent to-red-600 text-white t
            [--conic-position:from_290deg_at_center_top] 
            sm:w-[20vw] sm:h-[80vh] sm:bottom-[60vh] 
            md:w-[25rem] md:h-[70vh] md:bottom-[50vh]"
          >
            {/* Mask divs */}
            <div
              className="absolute bottom-0 right-0 z-20 h-full w-40 bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_left,white,transparent)]"
            />
            <div
              className="absolute bottom-0 right-0 z-20 h-40 w-full bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_top,white,transparent)]"
            />
          </motion.div>

          {/* Red blurred circle in center */}
          <div
            className="absolute z-50 h-10 w-[20vw] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl scale-y-[2] 
            sm:w-[15vw] sm:h-[5vh] md:w-[20rem] md:h-[8rem]"
          />

          {/* Cyan blur */}
          <motion.div
            initial={{ width: "10vw" }}
            whileInView={{ width: "20vw" }}
            transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
            className="absolute z-30 h-[10vh] w-[10vw] top-[10vh] translate-y-[30vh]  
            bg-gradient-to-t  blur-xl scale-y-[4] scale-x-[4] opacity-70
            sm:w-[15vw] sm:h-[5vh] sm:top-[15vh] 
            md:w-[15vw] md:h-[6rem]"
          />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 overflow-x-hidden">
        {children}
      </div>

      {/* Register Button */}
      <div className="flex flex-col justify-center items-center absolute bottom-[15vh] w-full sm:bottom-[8vh] md:bottom-[20vh]">
        <RegisterBtn />
        <p className="text-red-600 text-center text-xs font-thin isolate pb-6 sm:mt-4 sm:p-0 md:mt-0">
          VITV students please log in with your VIT email ID*
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="flex w-full justify-center absolute bottom-[5vh] items-center sm:bottom-[3vh] md:bottom-[5vh]">
        <CountdownTimer targetDate="2025-03-04T00:00:00" />
      </div>
      </div>

      {/*Mobile View*/}
      <div className="block md:hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative flex h-full items-center justify-center isolate overflow-hidden">
            {/* Left gradient */}
            <motion.div
              initial={{ opacity: 0.5, width: "20vw" }}
              whileInView={{ opacity: 1, width: "50vw" }}
              transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
              style={{
                backgroundImage:
                  "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
              }}
              className="absolute right-[49.9999%] bottom-[65vh] h-[120vh] w-[10vw] -scale-y-150 
            bg-gradient-conic from-red-600 via-transparent to-transparent text-white 
            [--conic-position:from_70deg_at_center_top] bg-to-red from to 
            sm:w-[20vw] sm:h-[80vh] sm:bottom-[60vh] 
            md:w-[25rem] md:h-[70vh] md:bottom-[50vh] mix-blend-screen"
            >
              {/* Mask divs */}
              <div  
                className="absolute bottom-0 left-0 z-20 h-40 w-full bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_top,white,transparent)]"
              />
              <div
                className="absolute bottom-0 left-0 z-20 h-full w-40 bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_right,white,transparent)]"
              />
            </motion.div>

            {/* Right gradient */}
            <motion.div
              initial={{ opacity: 0.5, width: "20vw" }}
              whileInView={{ opacity: 1, width: "50vw" }}
              transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
              style={{
                backgroundImage:
                  "conic-gradient(var(--conic-position), var(--tw-gradient-stops))",
              }}
              className="absolute left-[50%] bottom-[65vh] h-[120vh] w-[10vw] -scale-y-150 
            bg-gradient-conic from-transparent via-transparent to-red-600 text-white 
            [--conic-position:from_290deg_at_center_top] 
            sm:w-[20vw] sm:h-[80vh] sm:bottom-[60vh] 
            md:w-[25rem] md:h-[70vh] md:bottom-[50vh] mix-blend-screen"
            >
              {/* Mask divs */}
              <div
                className="absolute bottom-0 right-0 z-20 h-full w-40 bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_left,white,transparent)]"
              />
              <div
                className="absolute bottom-0 right-0 z-20 h-40 w-full bg-[#1E1B1A] 
              [mask-image:linear-gradient(to_top,white,transparent)]"
              />
            </motion.div>

            {/* Red blurred circle in center */}
            <div
              className="absolute z-50 h-10 w-[20vw] -translate-y-1/2 rounded-full bg-red-600 opacity-50 blur-3xl scale-y-[2] 
            sm:w-[15vw] sm:h-[5vh] md:w-[20rem] md:h-[8rem]"
            />

            {/* Cyan blur */}
            <motion.div
              initial={{ width: "10vw" }}
              whileInView={{ width: "20vw" }}
              transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
              className="absolute z-30 h-[10vh] w-[10vw] top-[10vh] translate-y-[30vh]  
             blur-xl scale-y-[3] opacity-50 
            sm:w-[15vw] sm:h-[5vh] sm:top-[15vh] 
            md:w-[15vw] md:h-[6rem]"
            />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-4 overflow-x-hidden">
          {children}
        </div>

        {/* Register Button */}
        <div className="flex flex-col justify-center items-center absolute bottom-[15vh] w-full sm:bottom-[8vh] md:bottom-[20vh]">
          <RegisterBtn />
          <p className="text-red-600 text-center text-xs font-thin isolate pb-6 sm:mt-4 sm:p-0 md:mt-0">
            VITV students please log in with your VIT email ID*
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex w-full justify-center absolute bottom-[5vh] items-center sm:bottom-[3vh] md:bottom-[5vh]">
          <CountdownTimer targetDate="2025-03-04T00:00:00" />
        </div>
      </div>
    </div>

  );
};

