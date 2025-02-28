"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bg from "/assets/round1/bg2.svg";
import { useRouter, usePathname } from "next/navigation";
import Round1Navbar from "@/components/events/Round1/navbar";
import toast, { Toaster } from "react-hot-toast";

export default function Round1Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <>
      <Toaster position="top-center" />
      {!pathname.startsWith("/events/event1/round1/start") && <>
            <Round1Navbar />
            <div className="absolute w-full h-full min-h-screen bg-[#232323]">
                {/* Background */}
                <div className="fixed inset-0 overflow-hidden">
                    <Image
                        src={bg}
                        alt="bg"
                        className="absolute inset-0 w-full h-full object-cover z-0 transform scale-110"
                        priority
                    />
                </div>

                {/* Main Content */}
                <div className="my-10 container w-[85vw] h-[85vh] py-20 px-auto text-center relative z-10 bg-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.2),inset_0_8px_16px_rgba(0,0,0,0.2)] mx-auto transition-all duration-300 rounded-lg">
                </div>
            </div>
        </>}
      {children}
    </>
  );
}