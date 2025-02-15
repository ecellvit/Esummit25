"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import bg from "/assets/bg.png";
import divbg from "/assets/divbg.png";
import Loader from "@/components/loader";

export default function page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add a loading state

  const joinTeam = () => {
    setIsLoading(true);
    router.push("joinTeam");
  };

  const createTeam = () => {
    setIsLoading(true);
    router.push("createTeam");
  };

  const userConsent = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/event1/consent");
      if (response.status === 200) {
        router.push("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
     
      toast.error(
        // axiosError.response?.data?.message || 
        "Error, Please Try Again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false); // Ensure that loader is hidden when the page loads
  }, []);

  return (
    <main
      className="h-screen w-screen flex items-center justify-center bg-black opacity-100"
      style={{ backgroundImage: `url(${bg.src})`, backgroundSize: "cover" }}
    >
      {isLoading && <Loader />} {/* Show loader based on isLoading state */}
      <div
        className="bg-white text-red p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh] opacity-100"
        // style={{
        //   backgroundImage: `url(${divbg.src})`,
        //   backgroundSize: "cover",
        // }}
      >
        <h2
          className="text-3xl lg:text-4xl font-bold text-center mb-12"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Agreement!
        </h2>
        <div className="w-full flex flex-col items-center gap-5">
          <p className="text-xl font-bold px-10 text-[#C72626] text-center">I understand that if I do not create a team or join an existing team before the end of registrations, I would be added to a random team.</p>
          <button
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
            }}
            onClick={userConsent}
          >
            I Agree
          </button>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
