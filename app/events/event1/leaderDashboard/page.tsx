"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";
import background from "/assets/bg.png";
import background1 from "/assets/divbg.png";
import picture from "@/assets/member.png"

type TeamMember = {
  id: number;
  name: string;
  regNo: string;
  mobNo: string;
  event1TeamRole?: number;
};

export default function Page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMemberIndex, setModalMemberIndex] = useState<number | null>(null);
  const [modalType, setModalType] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/event1/getTeamDetails");

      if (data?.teamMembersData?.length) {
        setTeamName(data.teamName);
        const formattedMembers = data.teamMembersData.map((member: TeamMember, index: number) => ({
          id: index, // Ensure each member has a unique ID
          name: member.name,
          regNo: member.regNo,
          mobNo: member.mobNo,
          event1TeamRole: member.event1TeamRole,
        }));

        setTeamMembers(formattedMembers);
        console.log("Fetched and formatted members:", formattedMembers);
      }
    } catch (error) {
      toast.error("An error occurred while fetching team data.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (index: number | null = null, type: string = "") => {
    setModalMemberIndex(index);
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setModalMemberIndex(null);
    setModalType("");
    setShowModal(false);
  };

  const handleRemove = async () => {
    if (modalMemberIndex === null) {
      toast.error("Error: No team member selected.");
      return;
    }

    const memberToRemove = teamMembers[modalMemberIndex]; // Find the member
    const memberIdToRemove = memberToRemove.id; // Get ID safely
    console.log('ripun', memberToRemove);

    if (!memberIdToRemove) {
      console.error("Error: Invalid memberIdToRemove", { modalMemberIndex, memberToRemove });
      toast.error("Error: Member ID is invalid.");
      return;
    }

    console.log(`Removing member ID: ${memberIdToRemove}`);

    setLoading(true);
    try {
      const response = await axios.patch("/api/event1/removeMember", {
        memberIdToRemove,
      });

      if (response.status === 200) {
        toast.success("Team member removed successfully");
        setTeamMembers((prev) => prev.filter((_, i) => i !== modalMemberIndex));
      } else {
        toast.error(response.data.message || "Failed to remove team member.");
      }
    } catch (error: any) {
      console.error("Error removing team member:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleViewTeamCode = async () => {
    try {
      const response = await axios.get("/api/event1/getTeamCode");
      setTeamCode(response.data.teamCode);
      setModalType("teamCode");
      setShowModal(true);
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
            className=" min-h-screen w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col items-center justify-start bg-cover bg-center p-4 rounded-lg "
            style={{ backgroundImage: `url(${background1.src})`, backgroundSize: "cover", backgroundPosition: "center",backgroundColor: "rgba(255, 255, 255, 0.5)", }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center drop-shadow-lg text-black">
              {teamName || "Team Name Not Found"}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-8 py-10">


              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div
  key={member.id || index}
  className="bg-[#141B2B] opacity-85 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-row items-center justify-between space-x-4"
  style={{ backgroundImage: `url(${background.src})` }}
>
  {/* Left Section - Member Details */}
  <div className="relative z-10 flex-1 p-4 text-left">
    <h2 className="text-lg font-bold mb-1 text-white">{member.name}</h2>
    <p className="text-xs mb-1 text-white">Reg. No.: {member.regNo}</p>
    <p className="text-xs text-white">Mobile No.: {member.mobNo}</p>
    <h1 className="text-lg font-bold mb-1 text-white">
       {member.event1TeamRole === 0 ? "LEADER" : "MEMBER"}
    </h1>

    <button
      className="mt-3 rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center w-[50vw] sm:w-[15vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300"
      onClick={() => {
        handleShowModal(index, member.event1TeamRole === 0 ? "leave" : "remove");
      }}
    >
      {member.event1TeamRole === 0 ? "Leave" : "Remove"}
    </button>
  </div>
  {/* Right Section - Member Image */}
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

                  // <div
                  //   key={member.id || index}
                  //   className="bg-[#141B2B] opacity-85 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-between"
                  //   style={{ backgroundImage: `url(${background.src})` }}
                  // >
                  //   <h2 className="text-lg font-bold mb-1 text-white">{member.name}</h2>
                  //   <h2 className="text-lg font-bold mb-1 text-white"
                  //   >
                  //     Role: {member.event1TeamRole === 0 ? "Leader" : "Member"}
                  //   </h2>
                  //   <p className="text-xs mb-1 text-white">Reg. No.: {member.regNo}</p>
                  //   <p className="text-xs text-white">Mobile No.: {member.mobNo}</p>

                  //   <button
                  //     className="mb-7 sm:landscape:w-[15vw] rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300"
                  //     onClick={() => {
                  //       handleShowModal(index, member.event1TeamRole === 0 ? "leave" : "remove");
                  //     }}
                  //   >
                  //     {member.event1TeamRole === 0 ? "Leave" : "Remove"}
                  //   </button>
                  // </div>
                ))
              ) : (
                <p className="text-white">No team members found.</p>
              )}
            </div>

            {/* <button className="btn-primary mt-4" onClick={handleViewTeamCode}>
              Add Member
            </button> */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
  {/* Add Member Button */}
  <button 
    className="btn-primary bg-gre-500 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform"
    onClick={handleViewTeamCode}
  >
    Add Member
  </button>

  {/* Leave Team Button (Only for Leader) */}
  {teamMembers.some(member => member.event1TeamRole === 0) && (
    <button
      className="btn-secondary bg-red-500 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform"
      onClick={() => handleShowModal(null, "leave")}
    >
      Leave Team
    </button>
  )}
</div>
            

            {/* Modal for Remove */}
            {showModal && modalType === "remove" && modalMemberIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md text-center">
                  <p className="mb-4">Are you sure you want to remove this user?</p>
                  <div className="flex justify-around">
                    <button onClick={handleRemove} className="bg-green-500 text-white px-4 py-2 rounded-md">
                      Yes
                    </button>
                    <button onClick={handleCloseModal} className="bg-red-500 text-white px-4 py-2 rounded-md">
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Leave */}
            {showModal && modalType === "leave" && modalMemberIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md text-center">
                  <p className="mb-4">Are you sure you want to leave the team?</p>
                  <div className="flex justify-around">
                    <button onClick={handleRemove} className="bg-green-500 text-white px-4 py-2 rounded-md">
                      Yes
                    </button>
                    <button onClick={handleCloseModal} className="bg-red-500 text-white px-4 py-2 rounded-md">
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Team Code */}
            {showModal && modalType === "teamCode" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Team Code</h2>
                  <p className="mb-4">{teamCode}</p>
                  <button className="btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </>
        
      )}
      

      <Toaster />
    </div>
  );
}
