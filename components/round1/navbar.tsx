"use client";
import React, { useState, useEffect } from 'react';
import { Timer, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "/assets/whiteLogo.svg";

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [walletBalance, setWalletBalance] = useState(50000);
  const [teamName, setTeamName] = useState("Alpha");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <nav
      className="fixed top-5 md:top-8 left-[50%] w-[80vw] lg:w-[70vw] h-[9vh]
        rounded-lg md:rounded-2xl border-2 border-red-700 shadow-xl z-20
        transition-transform duration-300 transform -translate-x-1/2 
        bg-black bg-opacity-75 text-md lg:text-lg"
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="h-full flex items-center">
          <Image
            src={logo}
            alt="Logo"
            className="h-6 lg:h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2 text-white hover:text-red-300 px-4 py-2 rounded-lg">
          <Timer className="w-5 h-5" />
          <span className="font-bold">{formatTime(timeLeft)}</span>
        </div>
        <div className="text-white hover:text-red-300 font-bold px-4 py-2 rounded-lg">
          Team {teamName}
        </div>
        <div className="flex items-center gap-2 text-white hover:text-red-300 px-4 py-2 rounded-lg">
          <Wallet className="w-5 h-5" />
          <span className="font-bold">₹ {walletBalance.toLocaleString()}</span>
        </div>
        <Link 
          href="./dashboard" 
          className="flex items-center gap-3 text-white hover:text-red-300 transition-colors duration-300"
        >
          <Home className="w-6 h-6" />
          <span className="font-medium">Dashboard</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;