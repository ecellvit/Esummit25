"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import bg from "/assets/bg.png"; 
import divbg from "/assets/divbg.png";

export default function page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string>('');
  const { data: session, update } = useSession();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      const response = await axios.post("/api/event1/createTeam", {
        teamName: teamName,
      });

      if (response.data.success === true) {
        toast.success(response.data.message);
        await update({ ...session, user: { ...session?.user, event1TeamRole: 0 } });
        router.push("/events/event1/leaderDashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error in joining the team"
      );
      setTeamName("");
    }
  };

  const joinTeam = () => {
    router.push("joinTeam");
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-black opacity-90" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover' }}>
      <div className="bg-white text-red p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh] opacity-80" style={{ backgroundImage: `url(${divbg.src})`, backgroundSize: 'cover' }}>
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" style={{ background: "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Team</h2>
        <div className="w-full flex flex-col items-center gap-5">
          <input
            type="text"
            placeholder="Enter Team Name"
            className="bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-4 focus:ring-[#C72626] shadow-inner"
            style={{ boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)" }}
            value={teamName}
            onChange={handleChange}
          />
          <button
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
            onClick={createTeam}
          >
            Create Your Own Team
          </button>
        </div>
        <hr className="w-4/5 my-12" style={{ border: "2px solid", borderImageSource: "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)", borderImageSlice: 1 }} />
        <p className="text-lg text-center">Don't want to create a team?</p>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
          onClick={joinTeam}
        >
          Find Team with Code
        </button>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
          onClick={joinTeam}
        >
          Join any Random Team
        </button>
      </div>
      <Toaster />
    </main>
  );
}