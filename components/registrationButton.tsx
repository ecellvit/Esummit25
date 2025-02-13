"use client";

import React from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";

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

    if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("VIT students can't register for this event");
      return;
    }

    if (event >= 1 && event <= 4 && !userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("Use your college email ID (@vitstudent.ac.in) to register");
      return;
    }

    console.log("Registering for event:", event);
    
    try {
      const response = await axios.post("/api/eventRegistration/register", { event });
      console.log("API Response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events || [];
        newUserEvents.push(event);
        await update({ ...session, user: { ...session?.user, events: newUserEvents } });

        router.push(event === 1 ? `/events/event${event}/createTeam` : "/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Registration error:", axiosError.response?.data);

      if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        return;
      }
      toast.error("An error occurred while registering.");
    }
  };

<<<<<<< HEAD
  const handleDeregister = async (event: number) => {
    try {
      const response = await axios.post("/api/eventRegistration/deregister", { event });

      if (response.status === 201 || response.status === 202) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events?.filter(e => e !== event);
        await update({ ...session, user: { ...session?.user, events: newUserEvents } });
        router.push("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Deregistration error:", axiosError.response?.data);

      if (axiosError.response?.status === 403) {
        toast.error("Please leave your team before deregistering.");
      } else if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        return;
      } else {
        toast.error("An error occurred while deregistering.");
      }
=======
  const handleDeregister = async (event: Number | null) => {
    try {
        console.log("Deregistering event:", event); // Log the event being deregistered
        const response = await axios.post("/api/eventRegistration/deregister", { event : Number(event) });
        console.log("API Response:", response);
        
        
        if (response.status === 201 || response.status === 202) {
            toast.success(response.data.message);
            const newUserEvents = session?.user.events?.filter(e => e !== event);
            await update({ ...session, user: { ...session?.user, events: newUserEvents } });
            router.push('/');
        } else {
            throw new Error("Error processing event deregistration");
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Deregistration error:", axiosError); // Log the error details

        if (axiosError.response?.status === 403) {
            toast.error("Please leave your team before deregistering.");
        } else if (axiosError.response?.status === 401) {
            toast.error("Please fill out your details first");
            router.push('/userDetails');
        } else {
            toast.error("An error occurred while deregistering.");
            console.log(error);
        }
>>>>>>> 725c1c9 (deregister event final push (hope so..))
    }
};

  return (
    <div className="relative top-18 left-1/2 transform -translate-x-1/2 z-10 w-full py-6 bg-transparent flex justify-center gap-12 flex-wrap">
      {[1, 2, 3, 4, 5].map((event) => (
        <button
          key={event}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5 rounded-3xl hover:scale-110 active:scale-95"
          onClick={() => session?.user.events?.includes(event) ? handleDeregister(event) : handleRedirect(event)}
        >
          {session?.user.events?.includes(event) ? `Deregister from Event ${event}` : `Register for Event ${event}`}
        </button>
      ))}
      <Toaster />
    </div>
  );
};

export default RegistrationButtons;
