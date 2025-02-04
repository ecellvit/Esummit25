"use client";

import React from "react";
import { useRouter } from "next/navigation"; 

interface EventButtonsProps {
  eventUrls: {
    [key: number]: string;
  };
}

const EventButtons: React.FC<EventButtonsProps> = ({ eventUrls }) => {
  const router = useRouter();

  const handleRedirect = (event: number) => {
    const redirectUrl = eventUrls[event] || "/"; 
    console.log(`Redirecting to: ${redirectUrl}`);
    router.push(redirectUrl); 
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
          onClick={() => handleRedirect(event)}
        >
          Event {event}
        </button>
      ))}
    </div>
  );
};

export default EventButtons;
