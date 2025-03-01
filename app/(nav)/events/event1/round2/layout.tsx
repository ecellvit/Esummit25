"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bg from "/assets/round2/bg1.svg";
import { useRouter, usePathname } from "next/navigation";
import Round2Navbar from "@/components/events/round2/navbar";
import Batch from "@/components/events/round2/batch";
import toast, { Toaster } from "react-hot-toast";

export default function Round1Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   const checkTeamStatus = async () => {
  //     try {
  //       const response = await fetch('/api/event1/round1/checkUser', {
  //         credentials: 'include'
  //       });
  //       if (!response.ok) {
  //         const data = await response.json();
  //         toast.error(data.message || "You don't have access to Round 1");
  //         router.push('/');
  //         return;
  //       }
  //     } catch (error) {
  //       console.error("Error checking team status:", error);
  //       toast.error("Failed to verify round 1 access");
  //       router.push('/');
  //     }
  //   };
  //   checkTeamStatus();
  // }, [router]);
  
  return (
    <>
      <Toaster position="top-center" />
      {!pathname.startsWith("/events/event1/round2/start") && <>
            <Round2Navbar />
            <Batch />
            <div className="fixed w-full h-full min-h-screen overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(63.7% 63.7% at 50% 50%, #35C0FB 0%, #126E9D 100%)",
                  }}>
            </div>
        </>}
      {children}
    </>
  );
}