"use client";
import AnswerForQualifier from "@/components/round0/Answer";
import Instructions from "@/components/round0/instructions";
import QualifierTimer from "@/components/round0/timer";
import QuestionForQualifier from "@/components/round0/Question";
import QuizEnd from "@/components/round0/quizend";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [questionCategory, setQuestionCategory] = useState<string>("instruction");
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [chronoNumber, setChronoNumber] = useState<number>(0);
  const [teamName, setTeamName] = useState<string>("");
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [test, setTest] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/');
    } else if (status === "authenticated") {
      setIsLoading(true);
      getUserData();
      getQuestionData();
    }
  }, [status, test]);

  const autoSubmit = () => {
    setIsLoading(true);
    console.log('hii');
    fetch(`/api/round0/autoSubmit`, {
      content: 'application/json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then(() => {
        setIsLoading(false);
      });
  };

  const getUserData = () => {
    console.log('hii');
    setIsLoading(false);
    fetch(`/api/userInfo`, {
      content: 'application/json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessTokenBackend}`,
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then((res) => res.json())
      .then((data: { user: UserData }) => {
        const user = data.user;
        if (user?.hasFilledDetails) {
          if (user?.teamId == null) {
            router.push('/');
          } else {
            if (user?.teamRole !== 0) {
              toast.error("Only leaders can access the quiz");
              router.push('/');
            } else {
              setIsLoading(false);
            }
          }
        } else {
          toast.error('Please register the Event first');
          router.push('/');
        }
      });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("submit button is clicked");
    console.log(finalAnswer);
    try {
      const response = await fetch("/api/round0/submitAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessTokenBackend}`,
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          answer: finalAnswer,
        }),
      });
      if (response.ok) {
        console.log(response);
        setFinalAnswer([]);
        setIsLoading(false);
        getQuestionData();
        setTest(response.statusText);
      } else {
        console.log("error");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  const getQuestionData = () => {
    console.log("hello");
    setIsLoading(false);

    fetch(`/api/round0/getQuestion`, {
      content: "application/json",
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
        console.log(questionCategory);
        setQuestionNumber(data.questionNumber);
        console.log(data.questionNumber);
        setChronoNumber(data.chronoNumber);
        console.log(data.chronoNumber);
        setTeamName(data.teamName);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <main
      className="min-h-screen pt-[5rem] p-6"
      style={{
        backgroundImage: `url(${bgWebsite.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {isLoading && <Loader />}
      <section>
        <div className="gap-2 z=1">
          {questionCategory === "instruction" && <Instructions />}
          {questionCategory !== "instruction" &&
            questionCategory !== "waiting" && (
              <div className="text-black">
                <QualifierTimer teamName={teamName} autoSubmit={autoSubmit} />
                <QuestionForQualifier
                  questionCategory={questionCategory}
                  questionNumber={questionNumber}
                  chronoNumber={chronoNumber}
                  setChronoNumber={setChronoNumber}
                  setQuestionNumber={setQuestionNumber}
                  className=""
                />
                <AnswerForQualifier
                  questionCategory={questionCategory}
                  questionNumber={questionNumber}
                  chronoNumber={chronoNumber}
                  finalAnswer={finalAnswer}
                  setChronoNumber={setChronoNumber}
                  setQuestionNumber={setQuestionNumber}
                  setFinalAnswer={setFinalAnswer}
                />
                <div className="w-full flex justify-center items-center">
                  {(questionCategory === "hard" && chronoNumber === 4) ? (
                    <button
                      id="nextButton"
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className="px-4 py-2 text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all flex items-center justify-center font-bold"
                    >
                      {isLoading ? (
                        <LoadingIcons.Oval color="black" height="20px" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  ) : (
                    <button
                      id="submitButton"
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className="px-4 py-2 text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all flex items-center justify-center font-bold"
                    >
                      {isLoading ? (
                        <LoadingIcons.Oval color="black" height="20px" />
                      ) : (
                        "Next"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          {questionCategory === "waiting" && <QuizEnd />}
        </div>
      </section>
    </main>
  );
}
