// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import axios, { AxiosError } from "axios";
// import { useSession } from "next-auth/react";
// import Loader from "@/components/loader";
// import Navbar from "@/components/navbar";
// import background from "/assets/bg.png";
// import background1 from "/assets/divbg.png";
// import picture from "@/assets/member.png";

// type TeamMember = {
//   id: number;
//   name: string;
//   regNo: string;
//   mobNo: string;
//   buttonLabel: string;
//   event1TeamRole?: number;
// };

// export default function MemberDashboard() {
//   const router = useRouter();
//   const { data: session, update } = useSession();
//   const [teamName, setTeamName] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
//     {
//       id: 1,
//       name: "Full Name 1",
//       regNo: "2XXXXXXXX",
//       mobNo: "XXXXXXXXXX",
//       buttonLabel: "Leave",
//     },
//     {
//       id: 2,
//       name: "Full Name 2",
//       regNo: "2XXXXXXXX",
//       mobNo: "XXXXXXXXXX",
//       buttonLabel: "Remove",
//     },
//     {
//       id: 3,
//       name: "Full Name 3",
//       regNo: "2XXXXXXXX",
//       mobNo: "XXXXXXXXXX",
//       buttonLabel: "Remove",
//     },
//     {
//       id: 4,
//       name: "Full Name 4",
//       regNo: "2XXXXXXXX",
//       mobNo: "XXXXXXXXXX",
//       buttonLabel: "Remove",
//     },
//   ]);
//   useEffect(() => {
//     setLoading(true);
//     getData();
//   }, [session?.user?.event1TeamRole]);
//   const [isLeaving, setIsLeaving] = useState<boolean>(false);
//   const getData = async () => {
//     setLoading(true);
//     try {
//       const userDataRes = await axios.get("/api/event1/getTeamDetails");
//       console.log(userDataRes);
//       if (userDataRes.status === 202) {
//         toast.error("You have become the leader of this team.");
//         await update({
//           ...session,
//           user: { ...session?.user, event1TeamRole: 0 },
//         });
//         router.push("/events/event1/leaderDashboard");
//       } else if (userDataRes.status === 404) {
//         toast.error("You are not a part of this team.");

//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
//         router.push("/events/event1/createTeam"); // Navigate after the toast is shown
//       }else if(userDataRes.status===200){
        
//       const userData = userDataRes.data;
//       setTeamName(userData?.teamName);
//       setTeamMembers(userData?.teamMembersData);
//       }

//       setLoading(false);
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       if (axiosError.response?.status === 409) {
//         try {
//           await update({
//             ...session,
//             user: { ...session?.user, event1TeamRole: null },
//           });
//           router.push("/events/event1/createTeam");

//           toast.error("You have been removed from this team.");
//         } catch (error) {}
//       }
//       setLoading(false);
//     }
//   };

//   const handleShowConfirmation = () => {
//     setShowConfirmation(!showConfirmation);
//   };
//   const handleLeave = async () => {
//     try {
//       const response = await axios.patch("/api/event1/leaveTeam");

//       if (response.status === 200) {
//         toast.success("You have left the team.");
//         await update({
//           ...session,
//           user: { ...session?.user, event1TeamRole: null },
//         });
//         router.push("/events/event1/createTeam");
//       } else {
//         toast.error("Error leaving the team. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error leaving team:", error);
//       toast.error("An error occurred while leaving the team.");
//     } finally {
//       setIsLeaving(false);
//     }
//   };

//   return (
//     <div
//       className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center p-4 text-black opacity-100"
//       style={{ backgroundImage: `url(${background.src})` }}
//     >
//       <Navbar />
//       {loading ? (
//         <Loader />
//       ) : (
//         <div
//           className="w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col items-center justify-start bg-cover opacity-100 bg-center p-4 rounded-lg "
//           // style={{
//           //   backgroundImage: `url(${background1.src})`,
//           //   backgroundSize: "cover",
//           //   backgroundPosition: "center",
//           //   backgroundColor: "rgba(255, 255, 255, 0.5)",
//           // }}
//         >
//           <h1 className="text-2xl sm:text-3xl font-[GreaterTheory] text-center drop-shadow-lg text-red-500">
//             {teamName}
//           </h1>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-8 py-10">
//             {teamMembers.map((member, index) => (
//               <div
//                 key={index}
//                 className=" opacity-100 rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-row items-center justify-between space-x-4"
//                 style={{ backgroundImage: `url(${background.src})` }}
//               >
//                 <div className="absolute right-0 top-0 w-1/2 h-full">
//                   <img
//                     src={picture.src}
//                     alt={`${member.name}'s profile`}
//                     style={{
//                       objectFit: "cover",
//                       width: "100%",
//                       height: "100%",
//                     }}
//                     className="opacity-100"
//                   />
//                 </div>
//                 <div className="relative z-10 flex-1 p-4 text-left right-8">
//                   <h2 className="text-l font-bold mb-1 text-white font-[PoppinsRegular]">
//                     {member?.name}
//                   </h2>
//                   <h2 className="text-l font-bold mb-1 text-white font-[PoppinsRegular]">
//                     Team Role:{" "}
//                     {member?.event1TeamRole === 0 ? "Leader" : "Member"}
//                   </h2>
//                   <p className="text-xs mb-1 text-white">
//                     Reg. No.: {member?.regNo}
//                   </p>
//                   <p className="text-xs text-white">
//                     Mobile No.: {member?.mobNo}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
//             <button
//               onClick={handleShowConfirmation}
//               className="btn-secondary bg-red-500 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase hover:scale-105 transition-transform-secondary bottom-5"
//             >
//               Leave Team
//             </button>

//             {showConfirmation && (
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                 <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center font-bold mt-[-75px]">
//                   <p className="mb-4 text-lg sm:text-xl text-center whitespace-nowrap font-[PoppinsRegular]">
//                     Do you want to leave this team?
//                   </p>
//                   <div className="flex items-center justify-center">
//                     <button
//                       onClick={handleLeave}
//                       disabled={isLeaving}
//                       className="bg-green-500 text-white px-4 py-2 rounded-md font-[PoppinsRegular] uppercase"
//                     >
//                       {isLeaving ? (
//                         <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
//                       ) : (
//                         "Yes"
//                       )}
//                     </button>
//                     <button
//                       onClick={handleShowConfirmation}
//                       disabled={isLeaving}
//                       className="bg-red-500 text-white px-4 py-2 rounded-md ml-4 font-[PoppinsRegular] uppercase"
//                     >
//                       No
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//       <Toaster />
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Loader from "@/components/loader";
import Navbar from "@/components/navbar";
import background from "/assets/bg.png";
import background1 from "/assets/divbg.png";
import picture from "@/assets/member.png";

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
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getData();
  }, [session?.user?.event1TeamRole]);

  const getData = async () => {
    setLoading(true);
    try {
      const userDataRes = await axios.get("/api/event1/getTeamDetails");
      if (userDataRes.status === 202) {
        toast.error("You have become the leader of this team.");
        await update({
          ...session,
          user: { ...session?.user, event1TeamRole: 0 },
        });
        router.push("/events/event1/leaderDashboard");
      } else if (userDataRes.status === 404) {
        toast.error("You are not a part of this team.");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/events/event1/createTeam");
      } else if (userDataRes.status === 200) {
        const userData = userDataRes.data;
        setTeamName(userData?.teamName);
        setTeamMembers(userData?.teamMembersData);
      }
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        try {
          await update({
            ...session,
            user: { ...session?.user, event1TeamRole: null },
          });
          router.push("/events/event1/createTeam");
          toast.error("You have been removed from this team.");
        } catch (error) {}
      }
      setLoading(false);
    }
  };

  const handleShowConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      const response = await axios.patch("/api/event1/leaveTeam");
      if (response.status === 200) {
        toast.success("You have left the team.");
        await update({
          ...session,
          user: { ...session?.user, event1TeamRole: null },
        });
        router.push("/events/event1/createTeam");
      } else {
        toast.error("Error leaving the team. Please try again later.");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("An error occurred while leaving the team.");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 text-black opacity-100"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      <Navbar />
      {loading || isLeaving ? (
        <Loader />
      ) : (
        <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-1/2 flex flex-col items-center justify-start bg-cover opacity-100 bg-center p-4 rounded-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-center drop-shadow-lg text-red-500">
            {teamName}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-8 py-10">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-lg p-3 text-center shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-row items-center justify-between space-x-4"
                style={{ backgroundImage: `url(${background.src})` }}
              >
                <img
                  src={picture.src}
                  alt={`${member.name}'s profile`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1 p-4 text-left">
                  <h2 className="text-lg font-bold text-white">
                    {member.name}
                  </h2>
                  <p className="text-sm text-white">Reg. No.: {member.regNo}</p>
                  <p className="text-sm text-white">
                    Mobile No.: {member.mobNo}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleShowConfirmation}
            className="bg-red-500 text-white px-4 py-2 rounded-md uppercase hover:scale-105 transition-transform"
          >
            Leave Team
          </button>
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Confirm Action</h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to leave this team? This action cannot
                  be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleLeave}
                    disabled={isLeaving}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Yes, Leave
                  </button>
                  <button
                    onClick={handleShowConfirmation}
                    disabled={isLeaving}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
}