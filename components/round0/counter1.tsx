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
//   const calculateTimeLeft = (): TimeLeft => {
//     const difference = +new Date(targetDate) - +new Date();

//     if (difference <= 0) {
//       return { hours: 0, minutes: 0, seconds: 0 }; // Ensure it stays at zero
//     }

//     return {
//       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//       minutes: Math.floor((difference / 1000 / 60) % 60),
//       seconds: Math.floor((difference / 1000) % 60),
//     };
//   };

//   const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

//   useEffect(() => {
//     if (
//       timeLeft.hours === 0 &&
//       timeLeft.minutes === 0 &&
//       timeLeft.seconds === 0
//     ) {
//       return; // Stop the effect if time is up
//     }

//     const timer = setInterval(() => {
//       const newTimeLeft = calculateTimeLeft();
//       setTimeLeft(newTimeLeft);

//       if (
//         newTimeLeft.hours === 0 &&
//         newTimeLeft.minutes === 0 &&
//         newTimeLeft.seconds === 0
//       ) {
//         clearInterval(timer); // Stop updating when countdown reaches 0
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]); // Re-run effect only when timeLeft changes

//   const formatNumber = (number: number) => String(number).padStart(2, "0");

//   return (
//     <div className="flex flex-col items-center space-y-3 pb-4">
//       <div className="text-md w-full text-black text-center sm:text-sm md:text-xl"
//       style={{fontFamily:"GreaterTheory"}}>
//         Time Remaining:
//       </div>

//       <div className="flex space-x-1 text-center">
//         {/* Hours */}
//         <div className="flex flex-col items-center ">
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
//         <div className="flex flex-col items-center ">
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
//         <div className="flex flex-col items-center ">
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
import "@/app/globals.css";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 }; // Stop at zero
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [stopped, setStopped] = useState<boolean>(false); // Track when the timer should stop

  useEffect(() => {
    if (stopped) return; // Stop updates when timer hits zero

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setStopped(true); // Stop further updates
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [stopped]); // Depend only on `stopped`, not `timeLeft`

  const formatNumber = (number: number) => String(number).padStart(2, "0");

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
        <div className="flex flex-col items-center">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatNumber(timeLeft.hours)}
          </div>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            :{formatNumber(timeLeft.minutes)}
          </div>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            :{formatNumber(timeLeft.seconds)}
          </div>
        </div>
      </div>
    </div>
  );
}
