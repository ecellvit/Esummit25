"use client";
import React, { useState, useEffect } from "react";
import "../app/globals.css";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type CountdownTimerProps = {
  targetDate: string;
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
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

  const formatNumber = (number: number) => String(number).padStart(2, "0");

  return (
    <div className="flex items-center justify-center  text-white">
      <div className="flex space-x-3 p-2">
        {[
          { label: "D", value: timeLeft.days },
          { label: "H", value: timeLeft.hours },
          { label: "M", value: timeLeft.minutes },
          { label: "S", value: timeLeft.seconds },
        ].map((time, index) => (
          <div key={index} className="flex flex-col items-center justify-center">
            <div className="relative w-16 h-16 text-3xl font-[PoppinsRegular] font-bold rounded-md flex items-center justify-center shadow-sm border border-red-500 border-opacity-55 before:absolute before:w-full before:h-0.5 before:bg-red-900 before:opacity-60 before:top-1/2 before:left-0 before:-translate-y-1/2">
              {formatNumber(time.value)}
            </div>
            <span className="text-xs mt-1 uppercase">{time.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
