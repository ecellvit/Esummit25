// "use client";
// import AnswerForQualifier from "@/components/round0/Answer";
// import Instructions from "@/components/round0/instructions";
// import QualifierTimer from "@/components/round0/timer";
// import QuestionForQualifier from "@/components/round0/Question";
// import QuizEnd from "@/components/round0/quizend";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import LoadingIcons from "react-loading-icons";
// import bgWebsite from "@/assets/bg.png";
// import Loader from "@/components/loader";

// export default function Qualifier() {
//   const [questionCategory, setQuestionCategory] = useState<"easy" | "medium" | "hard" | "caseStudy" | "instruction" | "waiting">("instruction");
//   const [questionNumber, setQuestionNumber] = useState(0);
//   const [chronoNumber, setChronoNumber] = useState(0);
//   const [teamName, setTeamName] = useState("");
//   const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [test, setTest] = useState("");
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);


//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     } else if (status === "authenticated") {
//       setIsLoading(true);
//       getUserData();
//       getQuestionData();
//     }
//   }, [status, test]);

//   // const checkRound = () => {
//   //   setIsLoading(true);
//   //   fetch(`/api/checkRound`, {
//   //     method: "GET",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //       Authorization: session?.accessTokenBackend
//   //         ? `Bearer ${session.accessTokenBackend}`
//   //         : "",
//   //       "Access-Control-Allow-Origin": "*",
//   //     },
//   //   })
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       if (data.level !== 0) {
//   //         router.push("/");
//   //       }
//   //     })
//   //     .finally(() => setIsLoading(false));
//   // };

//   const autoSubmit =async  () => {
//     setIsLoading(true);
//     await fetch(`/api/event1/round0/autoSubmit`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: session?.accessTokenBackend
//           ? `Bearer ${session.accessTokenBackend}`
//           : "",
//         "Access-Control-Allow-Origin": "*",
//       },
//     })
//       .then((res) => res.json())
//       // .finally(() => setIsLoading(false));
//   };

//   const getUserData = () => {
//     setIsLoading(true);
//     fetch(`/api/user/getUserDetails`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: session?.accessTokenBackend
//           ? `Bearer ${session.accessTokenBackend}`
//           : "",
//         "Access-Control-Allow-Origin": "*",
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const user = data.user;
//         if (user?.hasFilledDetails) {
//           if (!(user?.event1TeamId)) {
//             router.push("/");
//           } else if (user?.event1TeamRole !== 0) {
//             toast.error("Only leaders can access the quiz");
//             router.push("/");
//           }
//         } else {
//           toast.error("Please register for the event first");
//           router.push("/");
//         }
//       })
//       .catch(() => toast.error("Error fetching user data"))
//       .finally(() => setIsLoading(false));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/event1/round0/submitAnswer", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: session?.accessTokenBackend
//             ? `Bearer ${session.accessTokenBackend}`
//             : "",
//           "Access-Control-Allow-Origin": "*",
//         },
//         body: JSON.stringify({ answer: finalAnswer }),
//       });

//       if (response.ok) {
//         setFinalAnswer([]);
//         getQuestionData();
//         setTest(await response.json());
//       } else {
//         toast.error("Error submitting answer");
//       }
//     } catch {
//       toast.error("Server Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getQuestionData = () => {
//     setIsLoading(true);
//     fetch(`/api/event1/round0/getQuestion`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: session?.accessTokenBackend
//           ? `Bearer ${session.accessTokenBackend}`
//           : "",
//         "Access-Control-Allow-Origin": "*",
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && data.category) {
//           setQuestionCategory(data.category);
//           setQuestionNumber(data.questionNumber);
//           setChronoNumber(data.chronoNumber);
//           setTeamName(data.teamName);
//         } else {
//           toast.error("Invalid question data received");
//         }
//       })
//       .catch(() => toast.error("Error fetching question data"))
//       .finally(() => setIsLoading(false));
//   };

//   return (
//     <main
//       className="min-h-screen pt-[5rem] p-6"
//       style={{
//         backgroundImage: `url(${bgWebsite.src})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       {isLoading && <Loader />}
//       <section>
//         <div className="flex justify-between items-start w-full h-fit md:w-full">
//           {/* ECELL and FP Logos - Left */}
//           <div className="flex items-center px-5 space-x-6">
//             {/* <Image
//               src={ecellLogo}
//               alt="ECELL Logo"
//               width={150}
//               height={50}
//               className="cursor-pointer pl-2"
//               onClick={() => router.push("/")}
//             /> */}
//             {/* FP Logo - Just after ECELL Logo */}
//             {/* <Image
//               src={fpLogo}
//               alt="FP Logo"
//               width={50}
//               height={50}
//               className="cursor-pointer"
//             /> */}
//           </div>

//           {/* VIT and SW Logos - Right */}
//           <div className="flex flex-col items-start ml-auto pr-8 space-y-1">
//             {" "}
//             {/* Added pr-8 to shift VIT logo left */}
//             {/* <Image
//               src={vitLogo}
//               alt="VIT Logo"
//               width={150}
//               height={100}
//               className="pl-2"
//             />
//             <Image
//               src={swLogo}
//               alt="Student Welfare Logo"
//               width={150}
//               height={250}
//             /> */}
//           </div>
//         </div>

//         {/* {isLoading && <Loader />} */}
//         <div className="gap-2 z=1">
//           {questionCategory === "instruction" && <Instructions />}
//           {questionCategory !== "instruction" &&
//             questionCategory !== "waiting" && (
//               <div className="text-white">
//                 <QualifierTimer teamName={teamName} autoSubmit={autoSubmit} duration={0.5 * 60 * 1000}/>
//                 <QuestionForQualifier
//                   questionCategory={questionCategory as "easy" | "medium" | "hard" | "caseStudy" | "instruction" | "waiting"}
//                   questionNumber={questionNumber}
//                   chronoNumber={chronoNumber}
//                   setChronoNumber={setChronoNumber}
//                   setQuestionNumber={setQuestionNumber}
//                 />
//                 <AnswerForQualifier
//                   questionCategory={questionCategory}
//                   questionNumber={questionNumber}
//                   chronoNumber={chronoNumber}
//                   finalAnswer={finalAnswer}
//                   setChronoNumber={setChronoNumber}
//                   setQuestionNumber={setQuestionNumber}
//                   setFinalAnswer={setFinalAnswer}
//                   selectedOptions={selectedOptions}         // <-- Add this line
//                   setSelectedOptions={setSelectedOptions}   // <-- Add this line

//                 />
//                 <div className="w-full flex  justify-center items-center">
//                   {questionCategory === "hard" && chronoNumber === 4 ? (
//                     <button
//                       id="nextButton"
//                       type="submit"
//                       disabled={isLoading}
//                       onClick={handleSubmit}
//                       className="px-4 py-2  text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all flex items-center justify-center font-bold"
//                     >
//                       {isLoading ? (
//                         <LoadingIcons.Oval color="black" height="20px" />
//                       ) : (
//                         "Submit"
//                       )}
//                     </button>
//                   ) : (
//                     <button
//                       id="submitButton"
//                       type="submit"
//                       disabled={isLoading}
//                       onClick={handleSubmit}
//                       className="px-4 py-2 text-white rounded-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all flex items-center justify-center font-bold"
//                     >
//                       {isLoading ? (
//                         <LoadingIcons.Oval color="black" height="20px" />
//                       ) : (
//                         "Next"
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           {questionCategory === "waiting" && <QuizEnd />}
//         </div>
//       </section>
//     </main>
//   );
// }

"use client";
import { useRef } from "react";
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
import bgWebsite from "@/assets/bgRound0.png";
import Loader from "@/components/loader";

export default function Qualifier() {
  const [questionCategory, setQuestionCategory] = useState<
    "easy" | "medium" | "hard" | "instruction" | "waiting" | ""
  >("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [chronoNumber, setChronoNumber] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [finalAnswer, setFinalAnswer] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      // setIsLoading(true);
      fetchUserData();
      fetchQuestionData();
      // setIsLoading(false);
    }
  }, [status]);


const isSubmitting = useRef(false);

const autoSubmit = async () => {
  if (isSubmitting.current) return;
  isSubmitting.current = true;

  setIsLoading(true);
  try {
    const response = await fetch(`/api/event1/round0/autoSubmit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.accessTokenBackend
          ? `Bearer ${session.accessTokenBackend}`
          : "",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) throw new Error("Failed to auto-submit");

    await fetchQuestionData();
    setQuestionCategory("waiting");
  } catch {
    toast.error("Auto-submit failed");
  } finally {
    isSubmitting.current = false;
    setIsLoading(false);
  }
};

  // const autoSubmit = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`/api/event1/round0/autoSubmit`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: session?.accessTokenBackend
  //           ? `Bearer ${session.accessTokenBackend}`
  //           : "",
  //         "Access-Control-Allow-Origin": "*",
  //       },
  //     });

  //     if (!response.ok) throw new Error("Failed to auto-submit");
  //     if (response.ok) {
  //       // console.log('reload')
  //       location.reload();
  //     }
  //   } catch {
  //     toast.error("Auto-submit failed");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/getUserDetails`, {
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
      if (!res.ok) throw new Error();

      const user = data.user;
      if (!user?.hasFilledDetails) {
        toast.error("Please register for the event first");
        router.push("/");
      } else if (!user?.event1TeamId) {
        router.push("/");
      } else if (user?.event1TeamRole !== 0) {
        toast.error("Only leaders can access the quiz");
        router.push("/");
      }
    } catch {
      toast.error("Error fetching user data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionData = async () => {
    // setIsLoading(true);
    try {
      const res = await fetch(`/api/event1/round0/getQuestion`, {
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
      if (!res.ok || !data?.category) {
        throw new Error("Invalid question data received");
      }

      setQuestionCategory(data.category);
      setQuestionNumber(data.questionNumber);
      setChronoNumber(data.chronoNumber);
      setTeamName(data.teamName);
    } catch {
      toast.error("Error fetching question data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Clear previous question to avoid flickering
    setQuestionCategory("");
    setQuestionNumber(0);
    setChronoNumber(0);

    try {

      const response = await fetch("/api/event1/round0/submitAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessTokenBackend
            ? `Bearer ${session.accessTokenBackend}`
            : "",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ answer: finalAnswer }),
      });

      if (!response.ok) throw new Error();
      setFinalAnswer([]);
      await fetchQuestionData(); // Ensure fresh data is fetched
    } catch {
      toast.error("Error submitting answer");
    } finally {
      setIsLoading(false);
    }
  };


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
        <div className="gap-2 z=1">
          {questionCategory === "instruction" && <Instructions />}
          {questionCategory === "waiting" && <QuizEnd />}
          {questionCategory !== "instruction" &&
            questionCategory !== "waiting" && (
              <div className="text-white">
                <QualifierTimer teamName={teamName} autoSubmit={autoSubmit} />
                {!isLoading && (
                  <QuestionForQualifier
                    questionCategory={questionCategory}
                    questionNumber={questionNumber}
                    chronoNumber={chronoNumber}
                    setChronoNumber={setChronoNumber}
                    setQuestionNumber={setQuestionNumber}
                  />
                )}
                {!isLoading && (
                  <AnswerForQualifier
                    questionCategory={questionCategory}
                    questionNumber={questionNumber}
                    chronoNumber={chronoNumber}
                    finalAnswer={finalAnswer}
                    setChronoNumber={setChronoNumber}
                    setQuestionNumber={setQuestionNumber}
                    setFinalAnswer={setFinalAnswer}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                )}
                <div className="w-full flex  justify-center items-center">
                    {(questionCategory === "hard" && chronoNumber === 6) ? (
                      <button
                        id="nextButton"
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="px-4 py-2 flex justify-center text-white rounded-full bg-gradient-to-r from-red-500 to-red-800 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all font-bold"
                        style={{ fontFamily: "GreaterTheory" }}
                      >
                        {isLoading ? (
                          <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
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
                        className="px-4 py-2 flex justify-center items-center text-white rounded-full bg-gradient-to-r from-red-500 to-red-800 mt-4 w-1/4 md:w-1/6 h-12 hover:scale-105 transition-all font-bold"
                    style={{ fontFamily: "GreaterTheory" }}
                      >
                        {isLoading ? (
                          <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          "Next"
                        )}
                      </button>
                    )}
                    
                  </div>

              </div>
            )}
        </div>
      </section>
    </main>
  );
}
