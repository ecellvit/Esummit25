"use client";
import React, { useState, useEffect } from 'react';
import { Timer, Home, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "/assets/round2/logo.svg";
import invoice from "/assets/round2/invoice.svg";
import dash from "@/assets/round1/home.svg";
import Invoice from './invoice';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState(600);
  const [walletBalance, setWalletBalance] = useState(0);
  const router = useRouter();
  const [teamName, setTeamName] = useState("Loading...");
  const [error, setError] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

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

  const handleInvoiceClick = () => {
    setShowInvoice(true);
  };
 

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl min-w-fit text-center transform transition-all duration-300 scale-105 flex flex-col justify-end -mb-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
            <div className="mb-6 text-gray-600 text-left ">
              <Invoice />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
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
