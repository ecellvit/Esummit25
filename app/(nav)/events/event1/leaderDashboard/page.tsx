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
import Loader from "@/components/loader";

type TeamMember = {
  id: number;
  uid: string; // MongoDB ObjectID
  name: string;
  regNo: string;
  mobNo: string;
  email?: string;
  event1TeamRole?: number;
};

export default function Page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState<string>("");

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMemberIndex, setModalMemberIndex] = useState<number | null>(null);
  const [modalType, setModalType] = useState<string>("");
  const [teamCode, setTeamCode] = useState<string>("");
  const [showLeaderModal, setShowLeaderModal] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // if(!(session?.user?.events?.includes(1))) router.push('/');
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/event1/getTeamDetails");

      if (data?.teamMembersData?.length) {
        setTeamName(data.teamName);
        const formattedMembers = data.teamMembersData.map(
          (member: TeamMember, index: number) => ({
            id: index, // Ensure each member has a unique ID
            name: member.name,
            regNo: member.regNo,
            mobNo: member.mobNo,
            event1TeamRole: member.event1TeamRole,
          })
        );

        setTeamMembers(formattedMembers);
      }
    } catch (error) {
      toast.error("An error occurred while fetching team data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderLeave = async (index: number) => {
    setLoading(true);
    try {
      const email = teamMembers[index].email; // Ensure you're sending the email

      const response = await axios.patch("/api/event1/leaveTeam", { email });

      if (response.status === 200) {
        toast.success("Team leader removed successfully");
        setTeamMembers((prev) => prev.filter((member) => member.email !== email));
      } else {
        toast.error(response?.data.message || "Failed to remove team member.");
      }
    } catch (error) {
      console.error("Error removing team leader:", error);
      toast.error("An error occurred while removing the team leader.");
    } finally {
      setLoading(false);
      handleCloseModal();
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

  const handleDeleteTeam = async () => {
    setLoading(true);
    if (teamMembers.length === 1) {
      try {
        const response = await axios.delete("/api/event1/deleteTeam");
        if (response.status === 200) {
          await update({
            ...session,
            user: { ...session?.user, event1TeamRole: null },
          });
          toast.success("Team deleted successfully");
          setTeamMembers([]);
          handleCloseModal();
          router.push("/");
          setLoading(false);
        } else {
          var message = response.data.message;
          toast.error(message);
        }
      } catch (err) {
        toast.error("Failed to delete team");
      }
    } else {
      toast.error("First remove all the members");
    }
  };

  const handleLeave = async (newLeaderIndex: Number | null) => {

    setLoading(true);
    if (newLeaderIndex) {

      try {
        const response = await axios.patch("/api/event1/reassignLeader", {
          newLeaderIndex: newLeaderIndex
        });

        if (response.status === 200) {
          toast.success("Leader reassigned");
          await update({
            ...session,
            user: { ...session?.user, event1TeamRole: null },
          });
          router.push("/events/event1/createTeam");
          setShowModal(false);
          setLoading(false);
        } else {
          toast.error(response.data.message);
          setShowModal(false);
          setLoading(false);
        }
      } catch (err) {

        toast.error('Invalid Request');
      }
    } else {
      toast.error('Select a leader');

    }
    setLoading(false);
    setShowModal(false);
  };

  const handleRemove = async () => {
    if (modalMemberIndex === null) {
      toast.error("Error: No team member selected.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch("/api/event1/removeMember", {
        index: modalMemberIndex,
      });

      if (response.status === 200) {
        toast.success("Team member removed successfully");
        setTeamMembers((prev) => prev.filter((_, i) => i !== modalMemberIndex));
      } else {
        toast.error(response.data.message || "Failed to remove team member.");
      }
    } catch (error: any) {

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

  const handleCopyTeamCode = async () => {
    try {
      await navigator.clipboard.writeText(teamCode);
      toast.success("Team code copied to clipboard!");
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to copy team code.");
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChangeTeamName = () => {
    setShowModal(true);
    setModalType("changeTeamName");
  };

  const handleConfirmChangeTeamName = async () => {
    setShowModal(false);
    setShowConfirmModal(true);
  };

  const handleSubmitTeamNameChange = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/event1/editTeamName", { teamName: newTeamName });
      if (response.status === 200) {
        toast.success("Team name changed successfully");
        setTeamName(newTeamName);
      } else {
        toast.error(response.data.message || "Failed to change team name.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center bg-cover h-full  w-full bg-center text-black opacity-100 overflow-auto min-h-screen"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <Navbar />
      {loading ? (
        // <div className="flex flex-col items-center justify-center">
        //   <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
        //   <p className="mt-3 text-blue">Loading team details....</p>
        // </div>
        <Loader />
      ) : (
        <>
          <div
            className=" w-full  sm:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col items-center justify-start bg-cover opacity-100 bg-center rounded-lg "
            // style={{
            //   backgroundImage: `url(${background1.src})`,
            //   backgroundSize: "cover",
            //   backgroundPosition: "center",
            //   backgroundColor: "rgba(255, 255, 255, 0.5)",
            // }}
          >
            <h1 className="text-2xl sm:text-4xl  font-[GreaterTheory] mb-4 pt-[10vh] text-center drop-shadow-lg text-red-700">
              {teamName || "Team Name Not Found"}
            </h1>


            {/* <button className="btn-primary btn-secondary font-[PoppinsRegular] uppercase  bg-red-700 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform flex items-center justify-center gap-2" onClick={handleChangeTeamName} >
              Edit Team Name
            </button> */}
            <div className="flex flex-grow flex-wrap flex-col items-center overflow-scroll md:overflow-hidden rounded-lg mt-4 p-4">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div
                    key={member.id || index}
                    className=" md:-[400px] w-[300px] rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex  items-center justify-between space-x-4 opacity-100"
                    style={{ backgroundImage: `url(${background.src})` }}
                  >
                    {/* Left Section - Member Details */}
                    <div className="relative z-10 flex-1 p-4 text-left">
                      <h2 className="text-xl font-bold font-[PoppinsRegular] mb-1 text-white">
                        {member.name}
                      </h2>
                      <p className="text-xs mb-1 text-white ">
                        Reg. No: {member.regNo}
                      </p>
                      <p className="text-xs mb-2 text-white ">
                        Mobile No: {member.mobNo}
                      </p>
                      <h1 className="text-lg font-bold mb-1 font-[PoppinsRegular] text-white">
                        {member.event1TeamRole === 0 ? "LEADER" : "MEMBER"}
                      </h1>
                      {/* {member.event1TeamRole !== 0 && (
                        <button
                          className="mt-3 btn-secondary bg-red-700 text-white px-4 py-2 rounded-md  hover:scale-105 transition-transform"
                          onClick={() => handleShowModal(index, "remove")}
                        >
                          Remove
                        </button>
                      )} */}
                    </div>

                    {/* Right Section - Member Image */}
                    <div className="absolute right-0 top-0 w-[35%] h-full">
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
            {teamMembers.length > 0 && (
              <div className="flex justify-center mt-4 w-full">
                <button
                  className="btn-primary btn-secondary bg-red-700 text-white px-4 py-2 font-[PoppinsRegular] uppercase rounded-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  onClick={async () => {
                    setLoading(true); // Set loading before the timeout
                    setTimeout(() => {
                      router.push("/events/event1/round0/instructions");
                      setLoading(false); // Set loading false AFTER the navigation
                    }, 1000);
                  }}
                >
                  Attempt Quiz
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              {/* Add Member Button */}
              {/* <button
                className="btn-primary btn-secondary bg-red-700 text-white px-4 py-2 rounded-md hover:scale-105 transition-transform"
                onClick={handleViewTeamCode}
                
              >
                
                
                Add Member
              </button> */}
              {/* {teamMembers.length<4 && <button
                className="btn-primary btn-secondary bg-red-700 text-white px-4 py-2 font-[PoppinsRegular] uppercase rounded-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                onClick={async () => {
                  setIsLoading(true);
                  await handleViewTeamCode();
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Add Member"
                )}
              </button>} */}


              {/* {teamMembers.length === 1 ? (
                <button
                  className="btn-secondary bg-red-700 text-white px-4 py-2 font-[PoppinsRegular] uppercase rounded-md hover:scale-105 transition-transform"
                  onClick={() => handleShowModal(null, "delete")}
                >
                  Delete Team
                </button>
              ) : (
                <button
                  className="btn-secondary bg-red-700 text-white px-4 py-2 font-[PoppinsRegular] uppercase rounded-md hover:scale-105 transition-transform"
                  onClick={() => handleShowModal(null, "leave")}
                >
                  Leave Team
                </button>
              )} */}
            </div>

            {/* Modal for Remove */}
            {showModal &&
              modalType === "remove" &&
              modalMemberIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-5 rounded-md font-[PoppinsRegular] text-center">
                    <p className="mb-4">
                      Are you sure you want to remove this member?
                    </p>
                    <div className="flex justify-around">
                      <button
                        onClick={handleRemove}
                        className="bg-green-700 text-white font-[PoppinsRegular] uppercase px-4 py-2 rounded-md"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="bg-red-700 text-white font-[PoppinsRegular] uppercase px-4 py-2 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Modal for Leave
            {showModal && modalType === "leave" && modalMemberIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md text-center">
                  <p className="mb-4">Are you sure you want to leave the team?</p>
                  <div className="flex justify-around">
                    <button onClick={handleRemove} className="bg-green-700 text-white px-4 py-2 rounded-md">
                      Yes
                    </button>
                    <button onClick={handleCloseModal} className="bg-red-700 text-white px-4 py-2 rounded-md">
                      No
                    </button>
                  </div>
                </div>
              </div>
            )} */}
            {/* Modal for Leave */}
            {showModal &&
              modalType === "leave" &&
              modalMemberIndex === null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-5 rounded-md text-center">
                    <p className="mb-4 font-[PoppinsRegular] ">
                      Are you sure you want to leave the team?
                    </p>
                    <div className="flex justify-around">
                      <button
                        onClick={() => setModalType("chooseLeader")} // Open leader selection modal
                        className="bg-green-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {showModal && modalType === "changeTeamName" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-4 font-[GreaterTheory]">
                    Enter New Team Name
                  </h2>
                  <input
                    type="text"
                    className="border p-2 rounded-md w-full "
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                  <div className="flex justify-around mt-4">
                    <button
                      className="bg-green-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      onClick={handleConfirmChangeTeamName}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-red-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showConfirmModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <h2 className="text-xl font-bold mb-4 font-[GreaterTheory]">
                    Confirm Team Name Change
                  </h2>
                  <p className="font-[PoppinsRegular]">
                    Are you sure you want to change the team name to
                    <span className="font-[GreaterTheory]">
                      "{newTeamName}"
                    </span>
                    ?
                  </p>
                  <div className="flex justify-around mt-4">
                    <button
                      className="bg-green-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      onClick={handleSubmitTeamNameChange}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-red-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModal && modalType === "chooseLeader" && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-5 rounded-md text-center">
                  <p className="mb-4">Choose a new leader:</p>
                  <ul className="space-y-2">
                    {teamMembers.slice(1).map(
                      (
                        member,
                        index // Exclude current leader (index 0)
                      ) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              handleLeave(index + 1);
                            }} // +1 to match actual index in teamMembers
                            className="bg-blue-700 text-white px-4 py-2 rounded-md w-full"
                          >
                            {member.name}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showModal &&
              modalType === "delete" &&
              modalMemberIndex === null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-5 rounded-md text-center font-[PoppinsRegular]">
                    <p className="mb-4">
                      Are you sure you want to delete this team?
                    </p>
                    <div className="flex justify-around">
                      <button
                        onClick={handleDeleteTeam}
                        className="bg-green-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="bg-red-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Modal for Team Code */}
            {showModal && modalType === "teamCode" && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-[90vw]">
                  <h2 className="text-2xl  mb-6 font-[GreaterTheory] text-center">
                    Team Code
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <p className="text-xl font-bold">{teamCode}</p>
                    <button
                      onClick={handleCopyTeamCode}
                      className="bg-blue-700 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase hover:bg-blue-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-red-700 text-white  font-[PoppinsRegular] uppercase px-4 py-2 rounded-md"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                  </div>
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