"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import bg from "/assets/bg.png";
import { motion } from "framer-motion";

export default function JoinTeam() {
  const [teamCode, setTeamCode] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      toast.error("Please Log in or Sign up");
    }
    if(!(session?.user?.events?.includes(1))) router.push('/');
  }, [status, router]);

  const fetchTeamName = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/event1/getTeamName/${teamCode}`);
      if (response.status == 200) {
        setTeamName(response.data.teamName);
        setShowDialog(true);
      } else {
        toast.error("Team code not found. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching the team name.");
    }
  };

  const handleConfirmJoin = async () => {
    setIsModalLoading(true);
    try {
      const response = await axios.post("/api/event1/joinTeam", { teamCode });

      if (response.status == 200) {
        await update({
          ...session,
          user: { ...session?.user, event1TeamRole: 1 },
        });
        toast.success("Successfully joined the team!");
        setShowDialog(false);
        setTimeout(() => router.push("/events/event1/memberDashboard"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while joining the team.");
    } finally {
      setIsModalLoading(false);
    }
  };

  return (
    <main
      className="h-screen w-screen flex items-center justify-center bg-black opacity-100"
      style={{ backgroundImage: `url(${bg.src})`, backgroundSize: "cover" }}
    >
      <div className="bg-white text-red p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg w-4/5 lg:w-3/5 h-[80vh] opacity-100">
        <h2
          className="text-3xl lg:text-4xl font-bold text-center mb-12"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Join Team
        </h2>
        <form
          className="w-full flex flex-col items-center gap-5"
          onSubmit={fetchTeamName}
        >
          <input
            type="text"
            placeholder="Enter Team Code"
            className="bg-white text-gray-900 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-md text-lg focus:outline-none focus:ring-4 focus:ring-[#C72626] shadow-inner"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
            }}
          >
            Join Team With Code
          </button>
        </form>

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center relative"
            >
              <p className="text-lg font-medium text-gray-800">
                Do you want to join{" "}
                <span className="font-semibold text-blue-600">
                  Team - {teamName}
                </span>
                ?
              </p>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleConfirmJoin}
                  disabled={isModalLoading}
                  className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition flex items-center justify-center"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDialog(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  No
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
          }}
          onClick={() => router.push("createTeam")}
        >
          Create your Own Team
        </button>
        <button
          className="mt-4 w-4/5 md:w-3/5 lg:w-2/5 p-3 rounded-xl text-white text-lg font-semibold hover:scale-105 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(90deg, #611212 0%, #C72626 100%)",
          }}
          onClick={() => router.push("userConsent")}
        >
          Don't have a Team
        </button>
      </div>
      <Toaster />
    </main>
  );
}
