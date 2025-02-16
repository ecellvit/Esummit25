"use client";

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import bg from "/assets/bg.png"; 
import divbg from "/assets/divbg.png";
import Loader from "@/components/loader";


interface JoinTeamProps {
  teamCode?: string;
}

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

export default function JoinTeam() {  // Remove the props) {
  const [teamCode, setTeamCode] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const router = useRouter();
  const createTeam = () => {
    setIsLoading(true);
    router.push("createTeam");
  };
  const userConsent = () => {
    setIsLoading(true);
    router.push("userConsent");
  };
  const { data: session, status, update } = useSession();

  useEffect(() => {
    setLoading(true);
    if (status === "unauthenticated") {
      setLoading(false);
      router.push("/");
      toast.error("Please Log in or Sign up");
    } else if (status === "authenticated") {
      setLoading(false);
      // getUserData();
    }
  }, [status, router]);

  // const getUserData = async () => {
  //   try {
  //     const res = await fetch(`/api/userInfo`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${session?.accessTokenBackend}`,
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //     });
  //     const data = await res.json();
  //     const user = data.user;

  //     if (!user.hasFilledDetails) {
  //       router.push("/");
  //     } else if (user.teamId) {
  //       const redirect = user.teamRole === "1" ? "/memberDashboard" : "/leaderDashboard";
  //       router.push(redirect);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  const fetchTeamName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`/api/event1/getTeamName/${teamCode}`);

      if (response.status == 200) {
        const { teamName } = response.data;
        setTeamName(teamName);
        setShowDialog(true);
      } else {
        showMessage("Team code not found. Please try again.", "error");
      }
    } catch (error) {
      showMessage("An error occurred while fetching team name.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmJoin = async () => {
    setIsModalLoading(true);
    try {
      const response = await axios.post('/api/event1/joinTeam', { teamCode: teamCode });

      if (response.status == 200) {
        await update({...session, user: {...session?.user, event1TeamRole: 1}});
        showMessage("Successfully joined the team.", "success");
        setShowDialog(false);
        setTimeout(() => {
          router.push("/events/event1/memberDashboard")
        }, 1000);
      } else {
        showMessage(response.data.message, "error");
      }
    } catch (error) {
      showMessage("An error occurred while joining the team.", "error");
    } finally {
      setIsModalLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <main 
      className="h-screen w-screen flex items-center justify-center bg-black opacity-100" style={{ backgroundImage: `url(${bg.src})`, backgroundSize: 'cover' }}
    >
      {isLoading && <Loader />} {/* Show loader based on isLoading state */}
      <div className="bg-white text-red p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh] opacity-100 bg-white" style={{ backgroundSize: 'cover' }}>
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12" style={{ background: "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Join Team</h2>
        <form className="w-full flex flex-col items-center gap-5" onSubmit={fetchTeamName}>
          <input
            type="text"
            placeholder="Enter Team Code"
            className="bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-4 focus:ring-[#C72626] shadow-inner"
            style={{ boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)" }}
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></span>
            ) : (
              "Join Team With Code"
          
            )}
          </button>
        </form>

        {message && <div className={`mt-4 p-2 rounded-md text-${message.type === "success" ? "green" : "red"}-500`}>{message.text}</div>}

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-black">Do you want to join Team - {teamName}?</p>
              <button onClick={handleConfirmJoin} disabled={isModalLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
                {isModalLoading ? (
                  <div
                    style={{
                      border: "4px solid #f3f3f3",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      margin: "0 auto",
                    }}
                  ></div> 
                ) : (
                  "Yes"
                )}
              </button>
              <button onClick={() => setShowDialog(false)} className="ml-2 bg-gray-300 px-4 py-2 rounded">No</button>
            </div>
          </div>
        )}        
        <hr className="w-4/5 my-12" style={{ border: "2px solid", borderImageSource: "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)", borderImageSlice: 1 }} />
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
          onClick={createTeam}
        >
          {loading ? (
              <span className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></span>
            ) : (
              "Create your Own Team"
          
            )}
         
        </button>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #611212 0%, #C72626 100%)" }}
          onClick={userConsent}
        >
          {loading ? (
              <span className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></span>
            ) : (
              "Don't have a Team"
          
            )}
          
        </button>
      </div>
      <Toaster />
    </main>
  );
};