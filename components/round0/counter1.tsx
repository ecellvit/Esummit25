// // "use client";
// // import React, { useState, useEffect } from "react";
// // import "@/app/globals.css";

// // interface CountdownTimerProps {
// //   targetDate: string;
// // }

// // interface TimeLeft {
// //   hours: number;
// //   minutes: number;
// //   seconds: number;
// // }

// // export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
// //   const calculateTimeLeft = (): TimeLeft => {
// //     const difference = +new Date(targetDate) - +new Date();

// //     if (difference <= 0) {
// //       return { hours: 0, minutes: 0, seconds: 0 }; // Ensure it stays at zero
// //     }

// //     return {
// //       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
// //       minutes: Math.floor((difference / 1000 / 60) % 60),
// //       seconds: Math.floor((difference / 1000) % 60),
// //     };
// //   };

// //   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

// //   useEffect(() => {
// //     if (
// //       timeLeft.hours === 0 &&
// //       timeLeft.minutes === 0 &&
// //       timeLeft.seconds === 0
// //     ) {
// //       return; // Stop the effect if time is up
// //     }

// //     const timer = setInterval(() => {
// //       const newTimeLeft = calculateTimeLeft();
// //       setTimeLeft(newTimeLeft);

// //       if (
// //         newTimeLeft.hours === 0 &&
// //         newTimeLeft.minutes === 0 &&
// //         newTimeLeft.seconds === 0
// //       ) {
// //         clearInterval(timer); // Stop updating when countdown reaches 0
// //       }
// //     }, 1000);

// //     return () => clearInterval(timer);
// //   }, [timeLeft]); // Re-run effect only when timeLeft changes

// //   const formatNumber = (number: number) => String(number).padStart(2, "0");

// //   return (
// //     <div className="flex flex-col items-center space-y-3 pb-4">
// //       <div className="text-md w-full text-black text-center sm:text-sm md:text-xl"
// //       style={{fontFamily:"GreaterTheory"}}>
// //         Time Remaining:
// //       </div>

// //       <div className="flex space-x-1 text-center">
// //         {/* Hours */}
// //         <div className="flex flex-col items-center ">
// //           <div
// //             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
// //             style={{
// //               fontFamily: "GreaterTheory",
// //               background: "black",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //             }}
// //           >
// //             {formatNumber(timeLeft.hours)}
// //           </div>
// //         </div>

// //         {/* Minutes */}
// //         <div className="flex flex-col items-center ">
// //           <div
// //             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
// //             style={{
// //               fontFamily: "GreaterTheory",
// //               background: "black",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //             }}
// //           >
// //             :{formatNumber(timeLeft.minutes)}
// //           </div>
// //         </div>

// //         {/* Seconds */}
// //         <div className="flex flex-col items-center ">
// //           <div
// //             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
// //             style={{
// //               fontFamily: "GreaterTheory",
// //               background: "black",
// //               WebkitBackgroundClip: "text",
// //               WebkitTextFillColor: "transparent",
// //             }}
// //           >
// //             :{formatNumber(timeLeft.seconds)}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import React, { useState, useEffect } from "react";
// import "@/app/globals.css";

// interface CountdownTimerProps {
//   targetDate: string;
// }

// interface TimeLeft {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
//   const [stopped, setStopped] = useState<boolean>(false); // Track when the timer should stop
//   const calculateTimeLeft = (): TimeLeft => {
//     const difference = +new Date(targetDate) - +new Date();
    
//     if (difference <= 0) {
//       setStopped(true);
//       return { hours: 0, minutes: 0, seconds: 0 }; // Stop at zero
//     }
//     if(stopped==true){
//       return { hours: 0, minutes: 0, seconds: 0 };
//     }
    
//     return {
//       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((difference / 1000 / 60) % 60),
//       seconds: Math.floor((difference / 1000) % 60),
//     };
//   };
  
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

//   useEffect(() => {
//     if (stopped) return; // Stop updates when timer hits zero

//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (
//         newTimeLeft.hours === 0 &&
//         newTimeLeft.minutes === 0 &&
//         newTimeLeft.seconds === 0
//       ) {
//         setStopped(true); // Stop further updates
//         clearInterval(timer);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [stopped]); // Depend only on `stopped`, not `timeLeft`

//   const formatNumber = (number: number) => String(number).padStart(2, "0");

//   return (
//     <div className="flex flex-col items-center space-y-3 pb-4">
//       <div
//         className="text-md w-full text-black text-center sm:text-sm md:text-xl"
//         style={{ fontFamily: "GreaterTheory" }}
//       >
//         Time Remaining:
//       </div>

//       <div className="flex space-x-1 text-center">
//         {/* Hours */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             {formatNumber(timeLeft.hours)}
//           </div>
//         </div>

//         {/* Minutes */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.minutes)}
//           </div>
//         </div>

//         {/* Seconds */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.seconds)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import React, { useState, useEffect } from "react";
// import "@/app/globals.css";

// interface CountdownTimerProps {
//   targetDate: string;
// }

// interface TimeLeft {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
//   const [devToolsOpen, setDevToolsOpen] = useState(false);

//   // Prevent Inspect Element
//   // useEffect(() => {
//   //   // Disable Right Click
//   //   document.addEventListener("contextmenu", (event) => event.preventDefault());

//   //   // Disable Developer Tools Shortcuts
//   //   document.addEventListener("keydown", (event) => {
//   //     if (
//   //       event.key === "F12" ||
//   //       (event.ctrlKey &&
//   //         event.shiftKey &&
//   //         (event.key === "I" || event.key === "J"))
//   //     ) {
//   //       event.preventDefault();
//   //     }
//   //   });

//   //   // Detect DevTools Opening
//   //   const detectDevTools = setInterval(() => {
//   //     const threshold = 160; // Adjust this based on device speed
//   //     const start = new Date().getTime();
//   //     console.profile(); // Profile performance
//   //     console.profileEnd();
//   //     const end = new Date().getTime();

//   //     if (end - start > threshold) {
//   //       setDevToolsOpen(true);
//   //     } else {
//   //       setDevToolsOpen(false);
//   //     }
//   //   }, 1000);

//   //   return () => {
//   //     clearInterval(detectDevTools);
//   //   };
//   // }, []);

//   // Check localStorage for countdown expiration status
//   const getStoredTimerStatus = () => {
//     return localStorage.getItem("countdownExpired") === "true";
//   };

//   // Calculate remaining time
//   const calculateTimeLeft = (): TimeLeft => {
//     const now = new Date().getTime();
//     const targetTime = new Date(targetDate).getTime();
//     const difference = targetTime - now;

//     if (getStoredTimerStatus() || difference <= 0) {
//       return { hours: 0, minutes: 0, seconds: 0 };
//     }
//     else{
//       localStorage.getItem("countdownExpired") === "true";
//       return {
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / (1000 * 60)) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }
//   };

//   // Timer state
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

//   useEffect(() => {
//     if (getStoredTimerStatus()) {
//       setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
//       return;
//     }

//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (
//         newTimeLeft.hours === 0 &&
//         newTimeLeft.minutes === 0 &&
//         newTimeLeft.seconds === 0
//       ) {
//         localStorage.setItem("countdownExpired", "true");
//         clearInterval(timer);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   const formatNumber = (number: number) => String(number).padStart(2, "0");

//   return (
//     <div className="flex flex-col items-center space-y-3 pb-4">
//       <div
//         className="text-md w-full text-black text-center sm:text-sm md:text-xl"
//         style={{ fontFamily: "GreaterTheory" }}
//       >
//         Time Remaining:
//       </div>

//       <div className="flex space-x-1 text-center">
//         {/* Hours */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             {formatNumber(timeLeft.hours)}
//           </div>
//         </div>

//         {/* Minutes */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.minutes)}
//           </div>
//         </div>

//         {/* Seconds */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.seconds)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";
// import React, { useState, useEffect } from "react";
// import "@/app/globals.css";

// interface CountdownTimerProps {
//   targetDate: string;
// }

// interface TimeLeft {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
//   // Ensure countdownExpired starts as true
//   if (localStorage.getItem("countdownExpired") === null) {
//     localStorage.setItem("countdownExpired", "true");
//   }

//   const getStoredTimerStatus = () => {
//     return localStorage.getItem("countdownExpired") === "true";
//   };

//   const calculateTimeLeft = (): TimeLeft => {
//     const now = new Date().getTime();
//     const targetTime = new Date(targetDate).getTime();
//     const difference = targetTime - now;

//     if (difference > 0) {
//       localStorage.setItem("countdownExpired", "false");
//       return {
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / (1000 * 60)) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     } else {
//       localStorage.setItem("countdownExpired", "true");
//       return { hours: 0, minutes: 0, seconds: 0 };
//     }
//   };

//   // Timer state (default = 0)
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (
//         newTimeLeft.hours === 0 &&
//         newTimeLeft.minutes === 0 &&
//         newTimeLeft.seconds === 0
//       ) {
//         localStorage.setItem("countdownExpired", "true");
//         clearInterval(timer);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   const formatNumber = (number: number) => String(number).padStart(2, "0");

//   return (
//     <div className="flex flex-col items-center space-y-3 pb-4">
//       <div
//         className="text-md w-full text-black text-center sm:text-sm md:text-xl"
//         style={{ fontFamily: "GreaterTheory" }}
//       >
//         Time Remaining:
//       </div>

//       <div className="flex space-x-1 text-center">
//         {/* Hours */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             {formatNumber(timeLeft.hours)}
//           </div>
//         </div>

//         {/* Minutes */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.minutes)}
//           </div>
//         </div>

//         {/* Seconds */}
//         <div className="flex flex-col items-center">
//           <div
//             className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
//             style={{
//               fontFamily: "GreaterTheory",
//               background: "black",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             :{formatNumber(timeLeft.seconds)}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  // Function to calculate time left
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const targetTime = new Date(targetDate).getTime();
    const difference = targetTime - now;

    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    }
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.expired) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeLeft.expired]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="flex flex-col items-center space-y-3 pb-4">
      <div
        className="text-md w-full text-black text-center sm:text-sm md:text-xl"
        style={{ fontFamily: "GreaterTheory" }}
      >
        Time Remaining:
      </div>

      <div className="flex space-x-1 text-center">
        {/* Hours */}
        <div
          className="text-5xl font-bold"
          style={{ fontFamily: "GreaterTheory" }}
        >
          {formatNumber(timeLeft.hours)}
        </div>
        <div className="text-5xl font-bold">:</div>

        {/* Minutes */}
        <div
          className="text-5xl font-bold"
          style={{ fontFamily: "GreaterTheory" }}
        >
          {formatNumber(timeLeft.minutes)}
        </div>
        <div className="text-5xl font-bold">:</div>

        {/* Seconds */}
        <div
          className="text-5xl font-bold"
          style={{ fontFamily: "GreaterTheory" }}
        >
          {formatNumber(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;


