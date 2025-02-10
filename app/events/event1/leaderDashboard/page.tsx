"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import background from "/assets/bg.png";
import background1 from "/assets/divbg.png";
import picture from "@/assets/member.png";
import { useSession } from "next-auth/react";
import AddMemberModalWindow from "@/components/AddMemberModalWindow";

export default function Page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const { data: session, update } = useSession();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/event1/getTeamDetails");
      if (data?.teamMembersData?.length) {
        setTeamName(data.teamName);
        setTeamMembers(data.teamMembersData);
      }
    } catch (error) {
      toast.error("An error occurred while fetching team data.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeamCode = async () => {
    try {
      const response = await axios.get("/api/event1/getTeamCode");
      setTeamCode(response.data.teamCode);
      setShowAddMemberModal(true);
    } catch (error) {
      toast.error("Could not fetch team code.");
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center p-4 text-black pt-[12vh]"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <Navbar />
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-blue">Loading team details....</p>
        </div>
      ) : (
        <>
          <div
            className="min-h-screen w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col items-center justify-start bg-cover bg-center p-4 rounded-lg"
            style={{ backgroundImage: `url(${background1.src})` }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center text-black">
              {teamName || "Team Name Not Found"}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-8 py-10">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-[#141B2B] opacity-85 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-row items-center justify-between space-x-4"
                  >
                    <div className="relative z-10 flex-1 p-4 text-left">
                      <h2 className="text-lg font-bold mb-1 text-white">
                        {member.name}
                      </h2>
                      <p className="text-xs mb-1 text-white">
                        Reg. No.: {member.regNo}
                      </p>
                      <p className="text-xs text-white">
                        Mobile No.: {member.mobNo}
                      </p>
                      <h1 className="text-lg font-bold mb-1 text-white">
                        {member.event1TeamRole === 0 ? "LEADER" : "MEMBER"}
                      </h1>
                    </div>
                    <div className="absolute right-0 top-0 w-1/2 h-full">
                      <Image
                        src={picture}
                        alt={`${member.name}'s profile`}
                        layout="fill"
                        objectFit="cover"
                        className="opacity-100"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white">No team members found.</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform"
                onClick={handleViewTeamCode}
              >
                Add Member
              </button>
            </div>
          </div>
        </>
      )}
      {showAddMemberModal && (
        <AddMemberModalWindow
          teamName={teamName || ""}
          onClose={() => setShowAddMemberModal(false)}
        />
      )}
      <Toaster />
    </div>
  );
}
