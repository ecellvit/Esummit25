"use client";

import React from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

import { signIn, signOut, useSession } from "next-auth/react";
interface RegistrationButtonsProps {
  eventUrls: {
    [key: number]: string;
  };
}

const RegistrationButtons: React.FC<RegistrationButtonsProps> = ({ eventUrls }) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const userEmail = session?.user?.email || "";

  const handleRedirect = async (event: number) => {
    if (!userEmail) {
      signIn("google");
      return;
    }
    else{
      // Event 6: Restrict VIT students
      if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
        toast.error("VIT students can't register for this event");
        return;
      }

      // Events 1 to 5: Only allow VIT students
      if (event >= 1 && event <= 4 && !userEmail.endsWith("@vitstudent.ac.in")) {
        toast.error("Use your college email ID (@vitstudent.ac.in) to register");
        return;
      }
    }

    if (session?.user.events?.includes(event)) {
      if (event === 1 || event === 2) {
        router.push(`/events/event${event}/createTeam`);
      } else if (event >= 3 && event <= 4) {
        router.push(`/events/event${event}`);
      } else if (event === 5) {
        router.push("/events/event5");
      }
    }

    try {
      const response = await axios.post("/api/eventRegistration/register", { event });
      if (response.status === 200) {
        toast.success(response.data.message);

        const newUserEvents = session?.user.events;
        newUserEvents?.push(event);
        await update({...session, user: {...session?.user, events: newUserEvents } });

        if (event === 1 || event === 2) {
          router.push(`/events/event${event}/createTeam`);
        } else if (event >= 3 && event <= 4) {
          router.push(`/events/event${event}`);
        } else if (event === 5) {
          router.push("/events/event5");
        }
      } else {
        throw new Error("Error processing event registration");
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        router.push('/userDetails');
        return;
      }
    }
  };

  return (
    <div className="relative top-12 left-1/2 transform -translate-x-1/2 z-10 w-full py-6 bg-transparent flex justify-center gap-12 flex-wrap">
      {[1, 2, 3, 4, 5].map((event) => (
        <button
          key={event}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5 rounded-3xl hover:scale-110 active:scale-95"
          onClick={() => handleRedirect(event)}
        >
          Register for Event {event}
        </button>
      ))}
      <Toaster />
    </div>
  );
};

export default RegistrationButtons;
