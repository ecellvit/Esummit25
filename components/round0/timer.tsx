import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import "@/app/globals.css";

interface QualifierTimerProps {
  teamName: string;
  duration: number;
  autoSubmit: () => void;
}

const QualifierTimer: React.FC<QualifierTimerProps> = ({ teamName, autoSubmit,duration }) => {
  const [endTime, setEndTime] = useState<number>(Date.now()+duration);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetch("/api/event1/round0/getTime", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) =>
          res.ok ? res.json() : Promise.reject("Failed to fetch")
        )
        .then((data) => {
          console.log("TIME----", data.endTime);
          setEndTime(data.endTime);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [status,session, router]);

  // Function to calculate remaining time
  const calculateTimeRemaining = useCallback(() => {
    if (!endTime || isNaN(endTime)) return { minutes: "00", seconds: "00" };

    const now = Date.now();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) {
      autoSubmit();
      return { minutes: "00", seconds: "00" };
    }

    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  }, [endTime, autoSubmit]);

  // Update the timer display
  useEffect(() => {
    if (!endTime || isNaN(endTime)) return;

    setTimeRemaining(calculateTimeRemaining()); // Update immediately

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime, calculateTimeRemaining]);

  return (
    <div
      style={{
        background: "black",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      className="w-full flex justify-center items-center h-full"
    >
      <div className="flex flex-col justify-center items-center h-full w-fit text-black">
        <div className="text-2xl">Team Name: {teamName}</div>
        <div className="flex justify-evenly h-full w-full text-xl py-3">
          <div className="flex flex-col items-center">
            <div className="flex flex-col text-3xl">
              {timeRemaining.minutes}
            </div>
            MINS
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <div className="flex flex-col text-3xl">
              {timeRemaining.seconds}
            </div>
            SECS
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualifierTimer;
