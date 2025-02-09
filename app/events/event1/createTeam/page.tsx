"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; 

export default function page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string>('');
  const { data: session, update } = useSession();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const createTeam = async () => {
    try {
      const response = await axios.post('/api/event1/createTeam', {
        teamName: teamName
      })
      if (response.data.success == true) {
        toast.success(response.data.message);
        update({...session, user: {...session?.user, event1TeamRole: 0} });
        router.push('/events/event1/leaderDashboard');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Error in creating the team");
      setTeamName('');
    }
  }

  const joinTeam = () => {
    router.push("joinTeam");
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="bg-gray-700 text-white opacity-90 p-8 rounded-lg flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh]">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Create Team</h2>
        <div className="w-full flex flex-col items-center gap-5">
          <input
            type="text"
            placeholder="Enter Team Name"
            className="border border-gray-700 bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={teamName}
            onChange={handleChange}
          />
          <button
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            onClick={createTeam}
          >
            Create Your Own Team
          </button>
        </div>
        <hr className="w-4/5 border-gray-500 my-12" />
        <p className="text-lg text-center">Don't want to create a team?</p>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          onClick={joinTeam}
        >
          Find Team with Code
        </button>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          onClick={joinTeam}
        >
          Join any Random Team
        </button>
      </div>
      <Toaster />
    </main>
  );
}
