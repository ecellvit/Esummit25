'use client';
import React, { useState, useEffect } from "react";
/*import grad from "@/assests/assests/timerbg.svg";*/
import '../app/globals.css';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
};

type CountdownTimerProps = {
  targetDate: string;
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
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

  const formatNumber = (number: number) => String(number).padStart(2, '0');

  const LoadFont: React.FC = () => (
    <style>
      {`
        @font-face {
          font-family: GothamBlack;
          src: url("../public/fonts/Gotham-Black.ttf") format("truetype");
          font-weight: bold;
          font-style: normal;
        }
      `}
    </style>
  );
};