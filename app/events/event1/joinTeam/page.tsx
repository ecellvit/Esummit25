"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface JoinTeamProps {
  teamCode?: string;
}

interface Message {
  text: string;
  type: "success" | "error" | "info";
}

const JoinTeam: React.FC<JoinTeamProps> = ({ teamCode: propTeamCode }) => {
  const [teamCode, setTeamCode] = useState<string>(propTeamCode || "");
  const [teamName, setTeamName] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const router = useRouter();
  const createTeam = () => {
    router.push("createTeam");
  };
  const { data: session, status } = useSession();

  useEffect(() => {
    setLoading(true);
    if (status === "unauthenticated") {
      setLoading(false);
      router.push("/");
      toast.error("Please Log in or Sign up");
    } else if (status === "authenticated") {
      setLoading(false);
      getUserData();
    }
  }, [status, router]);

  const getUserData = async () => {
    try {
      const res = await fetch(`/api/userInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
      });
      const data = await res.json();
      const user = data.user;

      if (!user.hasFilledDetails) {
        router.push("/");
      } else if (user.teamId) {
        const redirect = user.teamRole === "1" ? "/memberDashboard" : "/leaderDashboard";
        router.push(redirect);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
        showMessage("Successfully joined the team.", "success");
        setShowDialog(false);
        setTimeout(() => {
          window.location.href = "/memberDashboard";
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
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="bg-gray-700 text-white opacity-90 p-8 rounded-lg flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh]">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">Join Team</h2>
        <form className="w-full flex flex-col items-center gap-5">
        <form className="flex flex-col items-center gap-8" onSubmit={fetchTeamName}></form>
          <input
            type="text"
            placeholder="Enter Team Code"
            className="border border-gray-700 bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            disabled={loading}
          >
            {loading ? (
              <div
                style={{
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #3498db",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  animation: "spin 2s linear infinite",
                  margin: "0 auto",
                }}
              ></div> // Spinner with inline styles
            ) : (
              "Join Team"
            )}
          </button>
        </form>

        {message && <div className={`mt-4 p-2 rounded-md text-${message.type === "success" ? "green" : "red"}-500`}>{message.text}</div>}

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p>Do you want to join Team-{teamName}?</p>
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
        <hr className="w-4/5 border-gray-500 my-12" />
        <p className="text-lg text-center">I don't have a team</p>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          onClick={createTeam}
        >
          Create your Own Team
        </button>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          onClick={createTeam}
        >
          Join any Random Team
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default JoinTeam;