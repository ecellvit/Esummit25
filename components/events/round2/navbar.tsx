"use client";
import React, { useState, useEffect } from 'react';
import { Timer, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "/assets/round2/logo.svg";
import invoice from "/assets/round2/invoice.svg";
import dash from "@/assets/round1/home.svg";
import Invoice from './invoice';
import { usePathname, useRouter } from 'next/navigation';
import { initializeSocket, socket } from '@/socket';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [timeLeft, setTimeLeft] = useState(600);
  const [walletBalance, setWalletBalance] = useState(0);
  const [teamName, setTeamName] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading,setLoading] = useState(false);

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
  }, []);

  const fetchTime = async () => {
    const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

    if (response.status === 200) {
      const { startedAt } = await response.json();

      // Convert startedAt (ISO format) to timestamp
      const startTime = new Date(startedAt).getTime();
      const currentTime = Date.now();

      const timePassed = Math.floor((currentTime - startTime) / 1000);

      if (pathname === '/events/event1/round2/phase1' || pathname === '/events/event1/round2/island1' || pathname === '/events/event1/round2/island2' || pathname === '/events/event1/round2/island3' || pathname === '/events/event1/round2/island4') {
        const timeLeft = 25 * 60 - timePassed;
        setTimeLeft(timeLeft > 0 ? timeLeft : 0);
      } else {
        const timeLeft = 25 * 60 - timePassed;
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
    setWalletBalance(Math.round(balance * 100) / 100);
  };

  const handleInvoiceClick = () => {
    setShowInvoice(true);
  };

  const handleSubmitForm = async()=>{
    
  }

  const handleDashboardClick = () => {
    router.push('/events/event1/round2/dashboard2'); 
  };

  return (
    <nav
      className="fixed -top-6 left-[50%] w-[60%] lg:w-[80%] h-[8vh]
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
        <div className="flex h-full items-center font-[GreaterTheory] text-white">
          Wallet: {walletBalance}
        </div>
        <div className="flex h-full items-center cursor-pointer" onClick={handleDashboardClick}>
          <Image src={dash} alt="Dashboard" className="h-6 lg:h-8 w-auto object-contain"/>
        </div>
        <div className="h-full flex items-center cursor-pointer" onClick={handleInvoiceClick}>
          <Image
            src={invoice}
            alt="Invoice"
            className="h-6 lg:h-8 w-auto object-contain"
          />
        </div>
      </div>
      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl mt-96 shadow-2xl w-[50%] max-w-lg text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
            <div className="mb-6 text-gray-600 text-left">
              <Invoice />
            </div>
            <div className="flex justify-center">
              <button
                onClick={()=>{console.log('clicked');setShowInvoice(false)}}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                 // ✅ Closes the invoice modal
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
