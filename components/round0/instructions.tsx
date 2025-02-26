"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CountdownTimer from "./counter1";
import { useRouter } from "next/navigation";

const Instructions: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter(); // Missing router initialization

  // Fixed date format - months are 0-indexed in JavaScript Date
  const targetDate: string = new Date(2025, 2, 27, 0, 34, 0).toISOString();

  const startQuiz = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/event1/round0/startQuiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessTokenBackend
            ? `Bearer ${session.accessTokenBackend}`
            : "",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const data = await res.json();

      if (res?.status === 200) {
        toast.success("Quiz is starting now!");
        router.push("/events/event1/round0"); // Fixed path syntax
      } else if (res.status === 403) {
        toast.error("Quiz has not started yet.");
      } else {
        console.log("Response data:", data);
        toast.error(data.message || "Too late to start.");
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
      <div className="flex flex-col items-start w-[90vw] md:w-[80vw] lg:w-[70vw] px-8 py-4 border rounded-xl m-2 text-lg md:text-xl">
        <div className="w-full flex justify-center mb-4">
          <CountdownTimer targetDate={targetDate} />
        </div>

        <h1 className="font-bold text-2xl md:text-3xl mb-4">
          Welcome to the Qualifying Round of FuturePreneurs 10.0!
        </h1>

        <p className="mb-4">
          This round evaluates your entrepreneurial knowledge and business
          understanding. Your performance in this quiz determines eligibility
          for the next round.
        </p>

        <h2 className="font-bold text-xl md:text-2xl mt-4 mb-2">
          General Instructions:
        </h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-1">
            All participants have 30 minutes to complete the quiz.
          </li>
          <li className="mb-1">
            A countdown timer is displayed at the top of the screen.
          </li>
          <li className="mb-1">The quiz auto-submits after 30 minutes.</li>
          <li className="mb-1">No negative marking.</li>
          <li className="mb-1">You can navigate and skip questions.</li>
        </ul>

        <h2 className="font-bold text-xl md:text-2xl mt-4 mb-2">
          Section Breakdown:
        </h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-1">Total: 25 questions across three sections.</li>
          <li className="mb-1">Easy: 8 questions (3 marks each).</li>
          <li className="mb-1">Medium: 12 questions (4 marks each).</li>
          <li className="mb-1">Hard: 5 questions (5 marks each).</li>
        </ul>

        <h2 className="font-bold text-xl md:text-2xl mt-4 mb-2">
          Best of luck to all participants!
        </h2>
      </div>

      <button
        className="px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none m-4 w-full max-w-md h-12 flex items-center justify-center font-bold hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
