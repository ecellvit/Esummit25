"use client";
import AnswerForQualifier from "@/components/round0/Answer";
import Instructions from "@/components/round0/instructions";
import QualifierTimer from "@/components/round0/timer";
import QuestionForQualifier from "@/components/round0/Question";
import QuizEnd from "@/components/round0/quizend";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import LoadingIcons from "react-loading-icons";
import Loader from "@/components/round0/loader";
import bgWebsite from "@/assets/bg.png";

interface QuestionData {
  category: string;
  questionNumber: number;
  chronoNumber: number;
  teamName: string;
}

interface UserData {
  hasFilledDetails: boolean;
  teamId: string | null;
  teamRole: number;
}

export default function Qualifier() {
  const [questionCategory, setQuestionCategory] =
    useState<string>("instruction");
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [chronoNumber, setChronoNumber] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("");
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      setIsLoading(true);
      getUserData();
      getQuestionData();
    }
  }, [status]);

  const autoSubmit = () => {
    setIsLoading(true);
    fetch(`/api/round0/autoSubmit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .finally(() => setIsLoading(false));
  };

  const getUserData = () => {
    setIsLoading(true);
    fetch(`/api/userInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data: { user: UserData }) => {
        const user = data.user;
        if (!user?.hasFilledDetails) {
          toast.error("Please register first");
          router.push("/");
          return;
        }
        if (user?.teamId == null || user?.teamRole !== 0) {
          toast.error("Only team leaders can access the quiz");
          router.push("/");
          return;
        }
      })
      .catch((err) => console.error("User fetch error:", err))
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/round0/submitAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ answer: finalAnswer }),
      });
      if (response.ok) {
        setFinalAnswer([]);
        getQuestionData();
      } else {
        console.log("error");
      }
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionData = () => {
    setIsLoading(true);
    fetch(`/api/round0/getQuestion`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data: QuestionData) => {
        setQuestionCategory(data.category);
        setQuestionNumber(data.questionNumber);
        setChronoNumber(data.chronoNumber);
        setTeamName(data.teamName);
      })
      .catch((err) => console.error("Error fetching question:", err))
      .finally(() => setIsLoading(false));
  };

  const submitButton = useMemo(
    () => (
      <button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit}
        className="px-4 py-2 text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all flex items-center justify-center font-bold"
      >
        {isLoading ? <LoadingIcons.Oval color="black" height="20px" /> : "Next"}
      </button>
    ),
    [isLoading]
  );

  return (
    <main
      className="min-h-screen pt-[5rem] p-6"
      style={{
        backgroundImage: `url(${bgWebsite.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isLoading && <Loader />}
      <section>
        {questionCategory === "instruction" && <Instructions />}
        {questionCategory !== "instruction" &&
          questionCategory !== "waiting" && (
            <div className="text-black">
              {teamName && (
                <QualifierTimer teamName={teamName} autoSubmit={autoSubmit} />
              )}
              <QuestionForQualifier
                questionCategory={questionCategory}
                questionNumber={questionNumber}
                chronoNumber={chronoNumber}
              />
              <AnswerForQualifier
                // questionCategory={questionCategory}
                questionNumber={questionNumber}
                chronoNumber={chronoNumber}
                finalAnswer={finalAnswer}
                setFinalAnswer={setFinalAnswer}
              />
              <div className="w-full flex justify-center items-center">
                {submitButton}
              </div>
            </div>
          )}
        {questionCategory === "waiting" && <QuizEnd />}
      </section>
    </main>
  );
}
