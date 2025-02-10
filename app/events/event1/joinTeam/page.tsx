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
  const { data: session, status,update } = useSession();

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
        const redirect = user.teamRole === "1" ? "/events/event1/memberDashboard" : "/events/event1/leaderDashboard";
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
        update({...session, user: {...session?.user, event1TeamRole: 1} });
        setShowDialog(false);
        setTimeout(() => {
          window.location.href = "memberDashboard";
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
    <div className="bg-purple h-screen w-screen opacity-85 flex flex-col items-center justify-around">
      <div className="bg-[purple] h-[45vh] w-[70vw] md:h-[57vh] md:w-[45vw] rounded-md flex flex-col justify-center">
        <div className="text-2xl lg:text-4xl font-bold text-center py-8 text-white">Enter Team Code</div>
        <form className="flex flex-col items-center gap-8" onSubmit={fetchTeamName}>
          <input
            type="text"
            placeholder="Enter Team Code"
            className="w-[53vw] md:w-[30vw] lg:w-[15vw] rounded-md p-2 text-blue"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-[30vw] md:w-[20vw] lg:w-[13vw] bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-3xl hover:scale-110 active:scale-95"
            disabled={loading} // Disable button when loading
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
      </div>
      <Toaster />
    </div>
  );
};

export default JoinTeam;
