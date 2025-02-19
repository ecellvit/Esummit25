// "use client";

// import { ApiResponse } from "@/types/ApiResponse";
// import axios, { AxiosError } from "axios";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import bg from "/assets/bg.png";
// import Loader from "@/components/loader";

// export default function Page() {
//   const router = useRouter();
//   const [teamName, setTeamName] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { data: session, update } = useSession();

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTeamName(event.target.value);
//   };

//   const createTeam = async () => {
//     if (!teamName.trim()) {
//       toast.error("Team name is required");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await axios.post("/api/event1/createTeam", { teamName });
//       if (response.data.success === true) {
//         toast.success(response.data.message);
//         await update({
//           ...session,
//           user: { ...session?.user, event1TeamRole: 0 },
//         });
//         router.push("/events/event1/leaderDashboard");
//       }
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast.error(
//         axiosError.response?.data.message || "Error in creating the team"
//       );
//       setTeamName("");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const joinTeam = () => {
//     setIsLoading(true);
//     router.push("joinTeam");
//   };

//   const userConsent = () => {
//     setIsLoading(true);
//     router.push("userConsent");
//   };

//   useEffect(() => {
//     setIsLoading(false);
//   }, []);

//   return (
//     <main
//       className="bg-cover bg-center bg-no-repeat flex items-center justify-center opacity-100"
//       style={{ backgroundImage: `url(${bg.src})`, backgroundSize: "cover" }}
//     >
//       {isLoading && <Loader />} {/* Show full-screen loader when isLoading is true */}

//       <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 lg:h-[90vh] opacity-100">
//         <h2
//           className="text-3xl lg:text-4xl font-bold text-center mb-12"
//           style={{
//             background:
//               "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           Create Team
//         </h2>

//         <div className="w-full flex flex-col items-center gap-5">
//           <input
//             type="text"
//             placeholder="Enter Team Name"
//             className="bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-4 focus:ring-[#C72626] shadow-inner"
//             style={{ boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)" }}
//             value={teamName}
//             onChange={handleChange}
//           />
//           <button
//             className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 transition-transform"
//             style={{
//               background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
//             }}
//             onClick={createTeam}
//           >
//             Create your Own Team
//           </button>
//         </div>

//         <hr
//           className="w-4/5 my-12"
//           style={{
//             border: "2px solid",
//             borderImageSource:
//               "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
//             borderImageSlice: 1,
//           }}
//         />

//         <button
//           className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg hover:scale-105 transition-transform"
//           style={{
//             background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
//           }}
//           onClick={joinTeam}
//         >
//           Find Team with Code
//         </button>

//         <button
//           className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 transition-transform"
//           style={{
//             background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
//           }}
//           onClick={userConsent}
//         >
//           Don't Have a Team
//         </button>
//       </div>
//       <Toaster />
//     </main>
//   );
// }

"use client";

import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import bg from "/assets/bg.png";
import Loader from "@/components/loader";

export default function Page() {
  const router = useRouter();
  const [teamName, setTeamName] = useState<string>("");
  const { data: session, update } = useSession();
  const [loadingButton, setLoadingButton] = useState<Boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const createTeam = async () => {
    setLoadingButton(true);
    if (!teamName.trim()) {
      toast.error("Team name is required");
      setLoadingButton(false);
      return;
    }


    try {
      const response = await axios.post("/api/event1/createTeam", { teamName });
      if (response.data.success === true) {
        toast.success(response.data.message);
        await update({
          ...session,
          user: { ...session?.user, event1TeamRole: 0 },
        });
        router.push("/events/event1/leaderDashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error in creating the team"
      );
    } finally {
      setLoadingButton(false);
    }
  };

  const joinTeam = () => {
    setLoadingButton(true);
    router.push("joinTeam");
    setLoadingButton(false);
  };

  const userConsent = () => {
    setLoadingButton(true);
    router.push("userConsent");
    setLoadingButton(false);
  };

  useEffect(() => {
    setLoadingButton(false);
  }, []);

  return (
    <main
      className="bg-cover bg-center bg-no-repeat flex items-center justify-center opacity-100"
      style={{ backgroundImage: `url(${bg.src})`, backgroundSize: "cover" }}
    >
      
      {loadingButton && <Loader/>}
      <div className="bg-white p-4 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 lg:h-[90vh] opacity-100">
        <h2
          className="text-3xl lg:text-4xl font-bold text-center mb-12"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Team
        </h2>

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
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center"
            style={{
              background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
            }}
            onClick={createTeam}
          >
            Create your Own Team
          </button>
        </div>

        <hr
          className="w-4/5 my-12"
          style={{
            border: "2px solid",
            borderImageSource:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            borderImageSlice: 1,
          }}
        />

        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg hover:scale-105 transition-transform flex items-center justify-center"
          style={{
            background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
          }}
          onClick={joinTeam}
        >
          Find Team with Code
        </button>

        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center"
          style={{
            background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
          }}
          onClick={()=>{
            setLoadingButton(true);
            userConsent();
          }}
        >
          Don't Have a Team
        </button>
      </div>
      <Toaster />
    </main>
  );
}