"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Round1Navbar from "@/components/events/Round1/navbar";
import toast, { Toaster } from "react-hot-toast";

export default function Round1Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkTeamStatus = async () => {
      try {
        const response = await fetch('/api/event1/round1/checkUser', {
          credentials: 'include'
        });
        if (!response.ok) {
          const data = await response.json();
          toast.error(data.message || "You don't have access to Round 1");
          router.push('/');
          return;
        }
      } catch (error) {
        console.error("Error checking team status:", error);
        toast.error("Failed to verify round 1 access");
        router.push('/');
      }
    };
    checkTeamStatus();
  }, [router]);
  
  return (
    <>
      <Toaster position="top-center" />
      {!pathname.startsWith("/events/event1/round1/start") && <Round1Navbar />}
      {children}
    </>
  );
}