"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CountdownTimer from "./counter1";
// import LoadingIcons from "react-loading-icons";
// import formLinks from "@/constant/round0/form";

const Instructions: React.FC = () => {
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const { data: session, status } = useSession();
  const targetDate = new Date(2024, 9, 3, 21, 0, 0).toISOString();




  /* const calculateTimeRemaining = () => {
    const now = new Date().getTime();

    const targetTime = new Date(
      2024,
      3,
      time.quizStartTime.day,
      time.quizStartTime.hour,
      time.quizStartTime.minute,
      time.quizStartTime.second
    );
    const timeDiff = targetTime - now;

    if (timeDiff <= 0) {
      // Target date has passed
      setButtonEnabled(true);
      return { minutes: "00", seconds: "00", hours: "00" };
    }

    if (Math.floor(timeDiff / 1000) <= 0) {
      console.log("asdf");
    }

    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    // if early then disable button

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); */

  // useEffect(() => {
  //   if (timeRemaining > 0) {
  //     const timerInterval = setInterval(() => {
  //       setTimeRemaining((prev) => prev - 1);
  //     }, 1000);

  //     return () => clearInterval(timerInterval); // Clear interval when component unmounts
  //   } else if (timeRemaining == 0) {
  //     setButtonEnabled(true); // Enable button when timer reaches 0
  //   }
  // }, [timeRemaining]);

  const startQuiz = () => {
    // e.preventDefault();
    // console.log("inside");
    setLoading(true);
    fetch("/api/round0/startQuiz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessTokenBackend ? `Bearer ${session.accessTokenBackend}` : '',
        "Access-Control-Allow-Origin": "*",
      }
    })
      .then((res) => {
        console.log("inside response", res);
        console.log(res.status);
        if (res.status === 200) {
          console.log("quizStartingNow.");
          location.reload();
        } else if (res.status === 403) {
          toast.error("Quiz has not started yet");
        } else {
          toast.error("too late");
        }
        setLoading(false);
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className="min-h-[100vh] text-black flex flex-col items-center">
      <div className="flex flex-col items-start w-[90vw] px-8 py-4 border rounded-xl m-2 text-xl">
        <div className="px-[43%]">
          <CountdownTimer targetDate={targetDate}/>
        </div>
        <p>
          <h1><b>Welcome to the Qualifying round of FuturePrenuers 10.0!</b></h1>
          <br/>
          This qualifying round will evaluate your entrepreneurial knowledge, and business understanding. Your performance on this quiz will determine your eligibility to advance to the next round. 

        </p>
        <br />
        <p>
          Read the following instructions carefully to ensure a smooth and
          successful completion of the quiz.
          
        </p>
        <br/>
        <h1><b>General Instructions:-</b></h1>
        <ul className="list-inside list-disc">
          <li>
          All the participants will be given 30 minutes for the completion of the quiz.
          </li>
          <li>
          A timer will be displayed at the top of the screen.              
          </li>
          <li>
          The quiz can only be submitted after completion, otherwise, it will auto-submit after 30 minutes.
          </li>
          <li>
          There is <span className="text-black-600">no</span> negative marking.
          </li>
          <li>
          You can skip and navigate through the questions. 
          </li>
          <br/>
          <h1><b>Section division:</b></h1>
          <li>
            The quiz consists of a total of 25 questions and is divided into THREE sections.
          </li>
          <li>
          Sections are categorized by the level of difficulty: Easy, Medium, and Hard.
          </li>
          <li>Section one consists of 8 questions, each of 3 marks.</li>
          <li>Section two consists of 12 questions, each of 4 marks.</li>
          <li>Section three consists of 5 questions, each of 5 marks.</li>
        </ul>
        <br/>
        <h2><b>Best of luck to all the participants!</b></h2>
      </div>
      <div>
        <button
          className={`px-4 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none m-4 w-full h-12 flex items-center justify-center font-bold hover:opacity-80 hover:cursor-pointer`}
          onClick={() => startQuiz()}
        >
          {/* {loading ? <LoadingIcons.Oval height={"20px"} /> : "Start Quiz"} */}
          {loading ? "Loading..." : "Start Quiz"}
        </button>
        <div className="my-4">
          {/* <p className="text-lg">Time remaining: <span className="text-red-500">{`${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, "0")}`}</span></p> */}
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default Instructions;
