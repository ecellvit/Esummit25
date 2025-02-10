"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

type TeamMember = {
  id: number;
  name: string;
  regNo: string;
  mobNo: string;
  buttonLabel: string;
  event1TeamRole?: number;
};

export default function MemberDashboard() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [check, setCheck] = useState<number>(0);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
      {
        id: 1,
        name: "Full Name 1",
        regNo: "2XXXXXXXX",
        mobNo: "XXXXXXXXXX",
        buttonLabel: "Leave",
      },
      {
        id: 2,
        name: "Full Name 2",
        regNo: "2XXXXXXXX",
        mobNo: "XXXXXXXXXX",
        buttonLabel: "Remove",
      },
      {
        id: 3,
        name: "Full Name 3",
        regNo: "2XXXXXXXX",
        mobNo: "XXXXXXXXXX",
        buttonLabel: "Remove",
      },
      {
        id: 4,
        name: "Full Name 4",
        regNo: "2XXXXXXXX",
        mobNo: "XXXXXXXXXX",
        buttonLabel: "Remove",
      },
    ]);
  useEffect(() => {
    setLoading(true)
    getData();
  }, [session?.user?.event1TeamRole]);

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/getUserDetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const data = await res.json();
      if (data?.user?.hasFilledDetails) {
        if (data?.user?.teamId) {
          if (data?.user?.teamRole === 1) {
            setLoading(false);
          } else {
            setLoading(false);
            router.push("/leaderDashboard");
          }
        } else {
          setLoading(false);
          router.push("/");
        }
      } else {
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An error occurred while fetching user data.");
      setLoading(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const userDataRes = await axios.get("/api/event1/getTeamDetails");

      const userData = userDataRes.data;
      setTeamName(userData?.teamName);
      setTeamMembers(userData?.teamMembersData);

      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        try {
          await update({...session, user: {...session?.user, event1TeamRole: null}});
          router.push("/events/event1/createTeam");
          console.log(session?.user);
          toast.error("You have been removed from this team.");
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    }
  };

  const handleShowConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleLeave = async () => {
    try {
      const response = await axios.patch("/api/event1/leaveTeam");

      if (response.data.status === 200) {
        toast.success("You have left the team.");
        await update({...session, user: {...session?.user, event1TeamRole: null}});
        router.push("/");
      } else {
        toast.error("Error leaving the team. Please try again later.");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("An error occurred while leaving the team.");
    }
  };

    return (
      <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center p-4 text-black pt-[12vh]">
        <h1 className="text-3xl font-extrabold mb-4 text-center drop-shadow-lg">
          {teamName}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4 py-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-[#141B2B] opacity-85 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-between"
            >
              <h2 className="text-lg font-bold mb-1 text-white">
                {member?.name}
              </h2>
              <h2 className="text-lg font-bold mb-1 text-white">
                Team Role: {member?.event1TeamRole === 0 ? "Leader" : "Member"}
              </h2>
              <p className="text-xs mb-1 text-white">Reg. No.: {member?.regNo}</p>
              <p className="text-xs text-white">Mobile No.: {member?.mobNo}</p>
            </div>
          ))}
        </div>
        <div>
          <button onClick={handleShowConfirmation} className="btn-primary bg-gradient-to-r from-blue-500 to-green-500 text-white p-5 rounded-3xl hover:scale-110 active:scale-95">
          Leave Team
          </button>
          {showConfirmation && (
            <div className="mt-4 p-4 bg-white rounded shadow-md text-center">
              <p className="mb-4">Do you want to leave this team?</p>
              <button onClick={handleLeave} className="btn-primary mr-4 rounded hover:scale-110 active:scale-95 shadow-md text-center">
                Yes
              </button>
              <button onClick={handleShowConfirmation} className="btn-secondary rounded hover:scale-110 active:scale-95 shadow-md text-center">
                No
              </button>
            </div>
          )}
          </div>
        <Toaster />
      </div>
    );
}