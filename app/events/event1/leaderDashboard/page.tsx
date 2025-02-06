"use client";
import React, { useEffect, useState } from "react";
// import img1 from "@/assests/assests/teammember.jpg";
import { useRouter } from "next/navigation";
// import { MyModal, ChangeLeaderModal } from "@/components/Modal";
import { useSession } from "next-auth/react";
// import LoadingScreen from "@/components/LoadingScreen";
import toast, { Toaster } from "react-hot-toast";
// import Navbar from "@/components/navbar";

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
  // const { data: session, status } = useSession();
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
    if (status === "unauthenticated") {
      setLoading(false);
      toast.error("Please Log in or Sign up");
      router.push("/");
    } else if (status === "authenticated") {
      setLoading(false);
      getUserData();
      getData();
    }
  }, [status, router]);

  const getUserData = async () => {
    try {
      const res = await fetch("/api/userInfo", {
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
      const userDataRes = await fetch("/api/userDataGet", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
      });

      const userData = await userDataRes.json();
      setTeamName(userData?.team?.teamName);
      setTeamMembers(userData?.members);
      setcheck(userData?.user?.teamRole);
      setIsQualified(userData?.team?.isQualified);

      const googleFormRes = await fetch("/api/googleDocs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
      });

      const googleFormData = await googleFormRes.json();
      if (googleFormData?.googleFormLink) {
        setGoogleFormLink(googleFormData.googleFormLink);
      }

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
      const response = await fetch("/api/removeMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
        body: JSON.stringify({ index }),
      });

      if (response.ok) {
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
      const response = await fetch("/api/deleteTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
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

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center p-4 text-black pt-[12vh]">
      {/* {loading && <LoadingScreen />} */}
      {/* <Navbar /> */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 text-center drop-shadow-lg">
        {teamName}
      </h1>
      <button
        onClick={() => handleShowModal(0)}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out shadow-lg">
          
        </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4 py-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-[#141B2B] opacity-85 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-between"
          >
            {/* <img
              src={img1.src}
              alt="Team Member"
              className="w-16 h-16 mb-3 rounded-full shadow-md"
            /> */}
            <h2 className="text-lg font-bold mb-1 text-white">
              {member?.name}
            </h2>
            <h2 className="text-lg font-bold mb-1 text-white">
              Team Role: {member?.teamRole === 0 ? "Leader" : "Member"}
            </h2>
            <p className="text-xs mb-1 text-white">Reg. No.: {member?.regNo}</p>
            <p className="text-xs text-white">Mobile No.: {member?.mobNo}</p>
          </div>
        ))}
      </div>

      {isQualified ? (
        <div className="flex flex-col text-black items-center border p-2 rounded-xl my-2">
          <h1 className="text-lg font-bold">
            Congratulations! <br />
            Your team had successfully made it through the qualifying round of
            Futurepreneurs 10.0. Your collective dedication, skills, and
            determination have truly set your team apart. <br />
            All the best for the next round!
          </h1>
          <h1 className="googleDocs Link">
            <a
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gradient-to-l hover:from-blue-500 hover:to-purple-500 transition duration-300 ease-in-out shadow-lg"
            >
              Wallet 2
            </a>
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

      {/* {showModal && (
        <MyModal
          isVisible={true}
          onClose={handleCloseModal}
          onConfirm={() => {
            if (modalType === "remove") {
              handleRemove(modalMemberId!);
            } else if (modalType === "add") {
              handleAddTeamMember();
            } else {
              deleteTeam();
            }
          }}
          text={
            modalType === "remove"
              ? "Do you want to remove this member?"
              : modalType === "add"
              ? "Do you want to add a member?"
              : "Do you want to delete the team?"
          }
        />
      )}

      {handleDeleteModal && (
        <MyModal
          isVisible={true}
          onClose={handleCloseModal}
          onConfirm={deleteTeam}
          text={deleteText}
        />
      )}

      {leaveLeaderModal && (
        <ChangeLeaderModal
          isOpen={leaveLeaderModal}
          onClose={() => setLeaveLeaderModal(false)}
          members={teamMembers}
          onConfirm={(selectedMemberIndex: number | null) => {
            if (selectedMemberIndex !== null) {
              setNum(selectedMemberIndex);
              console.log("New leader index:", selectedMemberIndex);
            }
            setLeaveLeaderModal(false);
          }}
        />
      )} */}

      <Toaster />
    </div>
  );
}
