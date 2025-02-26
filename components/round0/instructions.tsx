"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CountdownTimer from "./counter1";

const Instructions: React.FC = () => {
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const targetDate: string = new Date(2024, 9, 3, 21, 0, 0).toISOString();

  const startQuiz = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/round0/startQuiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessTokenBackend
            ? `Bearer ${session.accessTokenBackend}`
            : "",
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (res.status === 200) {
        toast.success("Quiz is starting now!");
        location.reload();
      } else if (res.status === 403) {
        toast.error("Quiz has not started yet.");
      } else {
        toast.error("Too late to start.");
      }
    } catch (error) {
      toast.error("An error occurred while starting the quiz.");
      console.error("Start Quiz Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100vh] text-black flex flex-col items-center">
      <div className="flex flex-col items-start w-[90vw] px-8 py-4 border rounded-xl m-2 text-xl">
        <div className="px-[43%]">
          <CountdownTimer targetDate={targetDate} />
        </div>
        <h1 className="font-bold">
          Welcome to the Qualifying Round of FuturePreneurs 10.0!
        </h1>
        <p>
          This round evaluates your entrepreneurial knowledge and business
          understanding. Your performance in this quiz determines eligibility
          for the next round.
        </p>
        <h2 className="font-bold mt-4">General Instructions:</h2>
        <ul className="list-disc list-inside">
          <li>All participants have 30 minutes to complete the quiz.</li>
          <li>A countdown timer is displayed at the top of the screen.</li>
          <li>The quiz auto-submits after 30 minutes.</li>
          <li>No negative marking.</li>
          <li>You can navigate and skip questions.</li>
        </ul>

        <h2 className="font-bold mt-4">Section Breakdown:</h2>
        <ul className="list-disc list-inside">
          <li>Total: 25 questions across three sections.</li>
          <li>Easy: 8 questions (3 marks each).</li>
          <li>Medium: 12 questions (4 marks each).</li>
          <li>Hard: 5 questions (5 marks each).</li>
        </ul>

        <h2 className="font-bold mt-4">Best of luck to all participants!</h2>
      </div>

      <button
        className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none m-4 w-full h-12 flex items-center justify-center font-bold hover:opacity-80 hover:cursor-pointer"
        onClick={startQuiz}
        disabled={loading}
      >
        {loading ? "Loading..." : "Start Quiz"}
      </button>

      <Toaster />
    </main>
  );
};

export default Instructions;
