"use client";
import React, { useState, useEffect } from 'react';
import { Timer, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "/assets/round1/logo.svg";
import home from "/assets/round1/home.svg";
import { usePathname, useRouter } from 'next/navigation';
import { socket, initializeSocket } from '@/socket';


const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState(600);
  const [walletBalance, setWalletBalance] = useState(0);
  const [teamName, setTeamName] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTime();
  }, [router, pathname]);
  
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch('/api/event1/round1/navbar');
        const data = await response.json();
        if (response.ok) {
          setTeamName("Team " + data.teamDetails.teamName);
          setWalletBalance(data.teamDetails.wallet);
        } else
          setError(data.message);
      } catch (error) {
        console.error("Error Fetching :", error);
        setError("Server Error");
      }
    };
    fetchTeamName();
  }, [router, pathname]);

  const fetchTime = async () => {
    const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

    if (response.status === 200) {
      const { startedAt } = await response.json();

      // Convert startedAt (ISO format) to timestamp
      const startTime = new Date(startedAt).getTime();
      const currentTime = Date.now();

      const timePassed = Math.floor((currentTime - startTime) / 1000);

      if (pathname === '/events/event1/round1/lease1' || pathname === '/events/event1/round1/lease2' || pathname === '/events/event1/round1/upgradeElement' || pathname === '/events/event1/round1/lease2&upgrade') {
        const timeLeft = 5 * 60 - timePassed;
        setTimeLeft(timeLeft > 0 ? timeLeft : 0);
      } else {
        const timeLeft = 10 * 60 - timePassed;
        setTimeLeft(timeLeft > 0 ? timeLeft : 0);
      }
    } else {
      router.refresh();
    }
  }

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

  // Connect to socket
  useEffect(() => {
    // Initial connection status check
    console.log("Socket connection status:", socket.connected);

    if (socket.connected) {
      onConnect();
    }

    async function setupSocket() {
      const result = await initializeSocket();

      if (!result.success) {
        setupSocket();
      }
    }

    if (!socket.connected) {
      setupSocket();
    }

    function onConnect() {
      socket.io.engine.on("upgrade", (transport) => {
        console.log("upgrade ::", transport.name);
      });
    }

    function onDisconnect(reason: string) {
      console.warn("Socket disconnected:", reason);
      if (reason === "ping timeout" || reason === "transport error") {
        socket.connect(); // Try reconnecting manually
      }
    }

    socket.on("connect", onConnect);
    socket.on("walletUpdate", onWalletUpdate);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("walletUpdate", onWalletUpdate);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket.connected]);

  const onWalletUpdate = (balance: number) => {
    console.log(walletBalance)
    setWalletBalance(balance);
  };

  return (
    <nav
      className="fixed left-[50%] w-[90%] lg:w-[90%] h-[10vh]
        rounded-lg md:rounded-2xl border-2 border-white-700 shadow-xl z-20
        transition-transform duration-300 transform -translate-x-1/2 
         bg-gradient-to-br from-[#B82121] to-[#000000] bg-opacity-100 text-md lg:text-lg mt-10"
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="h-full flex items-center">
          <Image
            src={logo}
            alt="Logo"
            className="h-6 lg:h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2 text-white px-4 py-2 rounded-lg">
          <Timer className="w-5 h-5" />
          <span style={{ fontFamily: 'GreaterTheory' }} >{formatTime(timeLeft)}</span>
        </div>
        <div className="text-white px-4 py-2 rounded-lg" style={{ fontFamily: 'GreaterTheory' }}>
          {teamName}
        </div>
        <div className=" bg-gradient-to-br from-[#FFFFFF] to-[#DDDDDDDD] border-2 border-white rounded-lg px-3 py-1 flex items-center gap-3 shadow-lg ">
        <Wallet className="w-5 h-5 text-[#B82121]" />
        <span className="text-[#B82121]" style={{ fontFamily: 'GreaterTheory' }}>
        {walletBalance.toLocaleString()}
        </span>
        </div>

        <Link 
          href="./dashboard" 
          className="h-full flex items-center"
        >
          <Image
            src={home}
            alt="Logo"
            className="h-6 lg:h-8 w-auto object-contain"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;