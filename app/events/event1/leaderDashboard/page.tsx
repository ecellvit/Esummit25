"use client";
import React, { useEffect, useState } from "react";
// import img1 from "@/assests/assests/teammember.jpg";
import { useRouter } from "next/navigation";
// import { MyModal, ChangeLeaderModal } from "@/components/Modal";
import { useSession } from "next-auth/react";
// import LoadingScreen from "@/components/LoadingScreen";
import toast, { Toaster } from "react-hot-toast";
// import Navbar from "@/components/navbar";
import axios from "axios";
import { error } from "console";

type TeamMember = {
  id: number;
  name: string;
  regNo: string;
  mobNo: string;
  buttonLabel: string;
  teamRole?: number;
};

export default function Page() {
  const router = useRouter();
//  const { data: session, status } = useSession();
  const [googleFormLink, setGoogleFormLink] = useState<string>(""); // New state for the form link
  const [check, setcheck] = useState<number>(0);
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

  const [teamName, setTeamName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMemberId, setModalMemberId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<string>("");
  const [leaveLeaderModal, setLeaveLeaderModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [num, setNum] = useState<number | null>(null);
  const [handleDeleteModal, setHandleDeleteModal] = useState<boolean>(false);
  const [deleteText, setDeleteText] = useState<string>("");
  const [isQualified, setIsQualified] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/getUserDetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      const data = await res.json();

      if (data?.user?.hasFilledDetails) {
        if (data?.user?.teamId) {
          if (data?.user?.teamRole === 0) {
            setLoading(false);
          } else {
            setLoading(false);
            router.push("/memberDashboard");
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
      // setcheck(userData?.user?.teamRole);
      // setIsQualified(userData?.team?.isQualified);

      // const googleFormRes = await fetch("/api/googleDocs", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Authorization: `Bearer ${session?.accessTokenBackend}`,
      //   },
      // });

      // const googleFormData = await googleFormRes.json();
      // if (googleFormData?.googleFormLink) {
      //   setGoogleFormLink(googleFormData.googleFormLink);
      // }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data.");
      setLoading(false);
    }
  };

  const handleShowModal = (id: number | null = null, type: string = "") => {
    if (id === 0) {
      if (teamMembers.length > 1) {
        setLeaveLeaderModal(true);
      } else {
        setHandleDeleteModal(true);
        setDeleteText("Do you want to delete the Team?");
      }
    } else {
      setModalMemberId(id);
      setModalType(type);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setModalMemberId(null);
    setModalType("");
    setShowModal(false);
  };

  const handleRemove = async (index: number) => {
    setLoading(true);
    try {
      const response = await axios.patch("/api/event1/removeMember",{memberIndexToRemove: index});

      if (response.data.status === 200) {
        toast.success("Team Member is removed");
        setLoading(false);
        window.location.reload();
      } else {
        toast.error("Team code not found. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("An error occurred while removing team member.");
      setLoading(false);
    }
    handleCloseModal();
  };

  const deleteTeam = async () => {
    setLoading(true);
    try {
      const response = await axios.delete("/api/event1/deleteTeam"); 

      if (response.data.status === 200) {
        toast.success("Team is deleted");
        setLoading(false);
        router.push("/");
      } else {
        toast.error("Team can't be deleted");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("An error occurred while deleting team.");
      setLoading(false);
    }
    handleCloseModal();
  };

  const handleAddTeamMember = () => {
    router.push("/");
  };

  const [teamCode, setTeamCode] = useState('');
  const LeaderDashboard = () => {
    const [showModal, setShowModal] = useState(false);
  };
  
    const handleViewTeamCode = async () => {
      try {
        const response = await axios.get('/api/event1/getTeamCode');
        setTeamCode(response.data.teamCode);
        setShowModal(true);
      } catch (error) {
        console.error('Error fetching team code:', error);
      }
    };
  
    const closeModal = () => {
      setShowModal(false);
    };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center p-4 text-black pt-[12vh]">
      {/* {loading && <LoadingScreen />} */}
      {/* <Navbar /> */}
      {/* <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center drop-shadow-lg">
        {teamName}
      </h1> */}
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
              Team Role: {member?.teamRole === 0 ? "Leader" : "Member"}
            </h2>
            <p className="text-xs mb-1 text-white">Reg. No.: {member?.regNo}</p>
            <p className="text-xs text-white">Mobile No.: {member?.mobNo}</p>
            {check === 0 && member.teamRole !== 0 && (
              <button
                className="mb-7 sm:landscape:w-[15vw] rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center portrait:lg:w-[30vw] md:max-w-[25vw] md:text-[1.6vh] sm:landscape:md:text-[1.7vh] lg:w-[15vw] w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300"
                onClick={() => handleShowModal(member.id, "remove")}
              >
                Leave
                {member.buttonLabel}
              </button>
            )}
          </div>
        ))}
      </div>
      {check === 0 && (
        <button
          className="btn-primary mt-4"
          onClick={handleViewTeamCode}
        >
          View Team Code
        </button>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Team Code</h2>
            <p className="mb-4">{teamCode}</p>
            <button
              className="btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isQualified ? (
        <div className="flex flex-col text-black items-center border p-2 rounded-xl my-2">
          <h1 className="text-lg font-bold">
            Congratulations! <br />
            Your team had successfully made it through the qualifying round of
            Futurepreneurs 10.0. Your collective dedication, skills, and
            determination have truly set your team apart. <br />
            All the best for the next round!
          </h1>
          
        </div>
      ) : (
        <div className="flex flex-col text-white items-center border p-2 rounded-xl my-2">
          <h1 className="text-lg font-bold">
            Thank you for your participation but we regret to inform you that
            you have not been qualified. We hope to see you in future events.
          </h1>
        </div>
      )}

      {showModal && modalType === "remove" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md text-center">
            <p className="mb-4">Are you sure you want to remove this user?</p>
            <div className="flex justify-around">
              <button
                onClick={() => handleRemove(modalMemberId!)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {leaveLeaderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md text-center">
            <p className="mb-4">You can't leave the team, assign a new leader first.</p>
            <div className="flex flex-col gap-2">
              {teamMembers.filter(member => member.teamRole !== 0).map((member, index) => (
                <button
                  key={index}
                  onClick={() => setNum(member.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {member.name}
                </button>
              ))}
            </div>
            {num !== null && (
              <div className="mt-4">
                <p className="mb-4">Are you sure you want to make this member the leader and leave?</p>
                <div className="flex justify-around">
                  <button
                    onClick={() => {
                      // Handle leader assignment and leave logic here
                      setLeaveLeaderModal(false);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setNum(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

