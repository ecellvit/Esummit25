"use client";
import React, { useEffect, useState } from "react";

interface AddMemberModalProps {
  teamName: string;
}

export default function AddMemberModalWindow({
  teamName,
}: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [teamCode, setTeamCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamCode = async () => {
      try {
        // Fetch team code from the server
        const response = await fetch("/api/event1/getTeamCode");
        const data = await response.json();

        console.log("Fetched Team Code:", data); // 🛑 Check the response in the console

        if (response.ok) {
          setTeamCode(data.teamCode); // Set the team code
        } else {
          setError(data.message || "Team code not found.");
        }
      } catch (err) {
        console.error("Error fetching team code:", err);
        setError("Something went wrong.");
      }
    };

    fetchTeamCode();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  const copyToClipboard = () => {
    if (teamCode) {
      navigator.clipboard.writeText(teamCode);
      alert("Team code copied to clipboard!");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[30vw] h-[40vh] p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <button
            onClick={closeModal}
            className="self-end text-gray-600 hover:text-black text-lg"
          >
            ✖
          </button>

          {/* Team Name */}
          <h1 className="text-2xl font-bold text-purple-600">{teamName}</h1>

          {/* Team Code */}
          <div className="mt-4 text-lg">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <>
                <span className="font-semibold">Team Code: </span>
                <span className="text-blue-600">
                  {teamCode || "Fetching..."}
                </span>
              </>
            )}
          </div>

          {/* Copy Button */}
          {!error && teamCode && (
            <button
              onClick={copyToClipboard}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Copy Team Code
            </button>
          )}
        </div>
      </div>
    )
  );
}
