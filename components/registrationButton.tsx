"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

interface RegistrationButtonsProps {
  eventUrls: {
    [key: number]: string;
  };
}

const RegistrationButtons: React.FC<RegistrationButtonsProps> = ({ eventUrls }) => {
  const router = useRouter();

  const handleRedirect = async (event: number) => {
    try {
      // Send event number to the API route
      const response = await axios.post("/api/eventRegistration", { event });

      if (response.status === 200) {
        toast.success(response.data.message);
        
        // Redirect based on the event number
        if (event === 1 || event === 2) {
          router.push(`/events/event${event}/Join_and_Create_Team`); // For event 1 or 2, specific leader dashboards
        } else if (event >= 3 && event <= 5) {
          router.push("/events/event3"); // For event 3, 4, or 5, common leader dashboard
        }
      } else {
        throw new Error("Error processing event registration");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Error processing event registration");
    }
  };

  return (
    <div
      style={{
        position: "relative", 
        top: "50px", 
        left: "50%",
        transform: "translateX(-50%)", 
        zIndex: 10, 
        width: "100%",
        padding: "30px 0",
        backgroundColor: "transparent", 
        display: "flex",
        justifyContent: "center",
        gap: "50px", 
        flexWrap: "wrap", 
      }}
    >
      {[1, 2, 3, 4, 5].map((event) => (
        <button
          key={event}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5 rounded-3xl hover:scale-110 active:scale-95"
          onClick={() => handleRedirect(event)} // Pass event number to handleRedirect
        >
          Register for Event {event}
        </button>
      ))}
      <Toaster />
    </div>
  );
};

export default RegistrationButtons;
