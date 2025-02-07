"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface EventButtonsProps {
  eventUrls: { [key: number]: string };
}

const EventButtons: React.FC<EventButtonsProps> = ({ eventUrls }) => {
  const router = useRouter();

  const handleRedirect = (event: number) => {
    const redirectUrl = eventUrls[event] || "/";
    console.log(`Redirecting to: ${redirectUrl}`);
    router.push(redirectUrl);
  };

  return (
    <div className="py-20 flex justify-center items-center gap-9 flex-wrap">
      {[1, 2, 3, 4, 5].map((event) => (
        <div key={event} className="relative">
  
          <div className="absolute -left-3 -bottom-3 w-full h-full border-2 border-black"></div>

      
          <button
            className="relative px-8 py-4 bg-[#673AB7] text-white font-extrabold text-xl shadow-lg transition-transform transform hover:scale-105"
            onClick={() => handleRedirect(event)}
          >
            Event {event}
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventButtons;
