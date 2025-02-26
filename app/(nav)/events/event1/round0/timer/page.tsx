"use client";
import Loader from "@/components/round0/loader";
import QualifierTimer from "@/components/round0/timer";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TimerPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const teamName = "Your Team Name"; // Set according to your application logic
  const duration = 16 * 60; // 16 minutes in seconds

  const autoSubmit = () => {
    // Your autoSubmit logic here
    toast.success("Submission successful!");
  };

  return (
    <QualifierTimer 
      teamName={teamName} 
      duration={duration} 
      autoSubmit={autoSubmit} 
    />
  );
};

export default TimerPage;