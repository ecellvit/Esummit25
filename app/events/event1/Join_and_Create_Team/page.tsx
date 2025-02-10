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
      toast.error(axiosError.response?.data.message || "Error in joining the team");
      setTeamName('');
    }
  }

  return (
    <main className="h-[100vh] w-[100vw] flex items-center justify-center ">
      <div className="bg-[#141B2B] text-white opacity-[85%] h-[80vh] w-[90vw] md:h-[80vh] md:w-[80vw] lg:h-[80vh] lg:w-[40vw] rounded-md flex justify-around  content-around flex-col portrait:lg:w-[90vw] portrait:lg:h-[70vh]">
        <div className=" hidden md:block lg:block text-center font-bold text-white text-[4vh] lg:text-[5vh]  ">
          Join a Team or Create a Team
        </div>
        <div className="text-white lg:hidden md:hidden text-center font-bold  text-[4vh] lg:text-[4vw] ">
          Join a Team{" "}
        </div>
        <div className="text-white lg:hidden md:hidden text-center font-bold  text-[4vh] lg:text-[4vw] ">
          or
        </div>
        <div className="text-white lg:hidden md:hidden text-center font-bold  text-[4vh] lg:text-[4vw] pb-2">
          Create a Team
        </div>
        <div className=" rounded-lg flex flex-col lg:gap-4 lg:content-around items-center justify-around ">
          <div className="lg:h-[20vh] flex-col justify-evenly  content-center lg:w-[25vw]">
            <h1 className="text-center text-white text-[4vh] py-5">
              Join your team
            </h1>
            <div className="flex flex-col  items-center gap-5">
              <button onClick={() => router.push("/events/event1/joinTeam")} className=" sm:landscape:w-[15vw]  mb-7 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center portrait:lg:w-[30vw]  md:max-w-[25vw] md:text-[20px] landscape:md:text-[1.6vh] lg:w-[15vw] w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300 ">
                Find team to join
              </button>
            </div>
          </div>
          <div className="lg:w-[30vw] md:w-[50vw] sm:w-[70vw] w-full border-2 border-[#D9D9D9] rounded-lg"></div>
          <div className="lg:h-[30vh] flex-col justify-center  content-center lg:w-[25vw]">
            <h1 className="text-center text-white text-[4vh] py-5">
              Create your team
            </h1>
            <div className="flex flex-col justify-evenly items-center gap-5">
              <input
                type="text"
                placeholder="Enter team name"
                className="border border-black   sm:landscape:w-[20vw] sm:landscape:h-[7vh] md:max-w-[40vw] portrait:md:max-w-[40vw] portrait:lg:w-[30vw] portrait:lg:text-2xl lg:w-[15vw] w-[55vw] h-[5vh] rounded-md text-xl text-slate-900  focus:outline-none focus:placeholder-transparent active:scale-95 transition-all duration-300"
                value={teamName}
                onChange={handleChange}
              />
              <button className="mb-7 sm:landscape:w-[15vw]  rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center portrait:lg:w-[30vw]  md:max-w-[25vw] md:text-[1.6vh]  sm:landscape:md:text-[1.7vh] lg:w-[15vw] w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300"
                onClick={createTeam}
              >
                Create your own team
              </button>
            </div>
          </div>
          <div className="lg:h-[15vh] flex-col justify-center  content-center lg:w-[25vw]">
            <div className="flex flex-col justify-evenly items-center gap-5">
              {
                <button className="mb-7 sm:landscape:w-[15vw] rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center portrait:lg:w-[30vw] md:max-w-[25vw] md:text-[1.6vh] sm:landscape:md:text-[1.7vh] lg:w-[15vw] w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300">
                  I don't have a team
                </button>
              }
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}

