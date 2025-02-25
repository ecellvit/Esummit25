'use client';
import React, { useState, useEffect } from "react";
import '@/app/globals.css';

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
    let timeLeft: TimeLeft;

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (number: number) => String(number).padStart(2, '0');

  return (
    <div className="flex flex-col items-center space-y-3 pb-4">
      <div className="text-md w-full  font-bold text-black sm:text-sm md:text-xl">
        Time Remaining:
      </div>

      <div className="flex space-x-1 text-center">
        {/* Hours */}
        <div className="flex flex-col items-center ">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "'GothamBlack', sans-serif",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatNumber(timeLeft.hours)}
          </div>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center ">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "'GothamBlack', sans-serif",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            :{formatNumber(timeLeft.minutes)}
          </div>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center ">
          <div
            className="text-5xl font-bold text-white sm:text-3xl md:text-5xl"
            style={{
              fontFamily: "'GothamBlack', sans-serif",
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
