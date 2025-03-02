import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import "@/app/globals.css";

interface QualifierTimerProps {
  teamName: string;
  autoSubmit: () => void;
}

const QualifierTimer: React.FC<QualifierTimerProps> = ({
  teamName,
  autoSubmit,
}) => {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    minutes: "00",
    seconds: "00",
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch endTime from the backend
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session) {
      fetch("/api/event1/round0/getTime", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("API RESPONSE:", data); // Debugging

          if (data.endTime) {
            const parsedEndTime = new Date(data.endTime).getTime(); // Convert to timestamp

            if (!isNaN(parsedEndTime)) {
              setEndTime(parsedEndTime); // Set endTime in milliseconds
            } else {
              console.error("Invalid endTime after parsing:", data.endTime);
            }
          } else {
            console.error("Invalid endTime received:", data.endTime);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
        });
    }
  }, [status, session, router]);



  // Function to calculate remaining time
  const calculateTimeRemaining = useCallback(() => {
    if (!endTime) return { minutes: "00", seconds: "00" };

    const now = Date.now();
    const timeDiff = endTime - now;

    if (timeDiff <= 0) {
      autoSubmit();
      return { minutes: "00", seconds: "00" };
    }

    return {
      minutes: String(Math.floor((timeDiff / 1000 / 60) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((timeDiff / 1000) % 60)).padStart(2, "0"),
    };
  }, [endTime, autoSubmit]);

  // Update the countdown every second
  useEffect(() => {
    if (!endTime) return;

    setTimeRemaining(calculateTimeRemaining()); // Update immediately

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime, calculateTimeRemaining]);

  if (endTime === null) {
    return (
      <div className="text-center text-xl text-black">Loading Timer...</div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center h-full">
      <div className="flex flex-col justify-center items-center h-full w-fit text-black">
        <div
          className="text-2xl"
          style={{
            fontFamily: "GreaterTheory",
            background: "black",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Team Name: {teamName}
        </div>
        <div className="flex justify-evenly h-full w-full text-xl py-3">
          <div
            className="flex flex-col items-center"
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <div
              className="flex flex-col text-3xl"
            >
              {timeRemaining.minutes}
            </div>
            MINS
          </div>
          <span
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            :
          </span>
          <div
            className="flex flex-col items-center"
            style={{
              fontFamily: "GreaterTheory",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
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

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import "@/app/globals.css";

// interface QualifierTimerProps {
//   teamName: string;
//   autoSubmit: () => void;
// }

// const QualifierTimer: React.FC<QualifierTimerProps> = ({
//   teamName,
//   autoSubmit,
// }) => {
//   const [endTime, setEndTime] = useState<number | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState({
//     minutes: "00",
//     seconds: "00",
//   });

//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // Fetch the endTime from the backend
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//       return;
//     }

//     if (status === "authenticated" && session) {
//       fetch("/api/event1/round0/getTime", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessTokenBackend}`,
//         },
//       })
//         .then((res) => {
//           if (!res.ok) throw new Error("Failed to fetch timer data");
//           return res.json();
//         })
//         .then((data) => {
//           console.log("API Response:", data);
//           if (data?.endTime && !isNaN(data.endTime)) {
//             setEndTime(Number(data.endTime)); // Ensure it's a number
//           } else {
//             console.error("Invalid endTime received:", data.endTime);
//           }
//         })
//         .catch((err) => {
//           console.error("Fetch error:", err);
//         });
//     }
//   }, [status, session, router]);

//   // Function to calculate remaining time
//   const calculateTimeRemaining = () => {
//     if (!endTime) return { minutes: "00", seconds: "00" };

//     const timeDiff = endTime - Date.now();
//     console.log("Time Difference:", timeDiff);
//     if (timeDiff <= 0) {
//       autoSubmit();
//       return { minutes: "00", seconds: "00" };
//     }

//     return {
//       minutes: String(Math.floor(timeDiff / 1000 / 60)).padStart(2, "0"),
//       seconds: String(Math.floor((timeDiff / 1000) % 60)).padStart(2, "0"),
//     };
//   };

//   // Update the countdown every second
//   useEffect(() => {
//     if (!endTime) return;

//     setTimeRemaining(calculateTimeRemaining());

//     const intervalId = setInterval(() => {
//       setTimeRemaining(calculateTimeRemaining());
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, [endTime]);

//   if (endTime === null) {
//     return (
//       <div className="text-center text-xl text-black">Loading Timer...</div>
//     );
//   }

//   return (
//     <div className="w-full flex justify-center items-center h-full">
//       <div className="flex flex-col justify-center items-center h-full w-fit text-black">
//         <div className="text-2xl"style={{fontFamily:" 'GreaterTheory'"}}>Team Name: {teamName}</div>
//         <div className="flex justify-evenly h-full w-full text-xl py-3"style={{fontFamily:" 'GreaterTheory'"}}>
//           <div className="flex flex-col items-center">
//             <div className="text-3xl">{timeRemaining.minutes}</div>
//             MINS
//           </div>
//           <span>:</span>
//           <div className="flex flex-col items-center">
//             <div className="text-3xl">{timeRemaining.seconds}</div>
//             SECS
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QualifierTimer;
