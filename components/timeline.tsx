"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import img1 from "/assets/image (1).svg";
import img2 from "/assets/image (2).svg";
import img3 from "/assets/image (3).svg";
import img4 from "/assets/image (4).svg";
import img5 from "/assets/image (5).svg";
import mob1 from "/assets/mobile (1).svg";
import mob2 from "/assets/mobile (2).svg";
import mob3 from "/assets/mobile (3).svg";
import mob4 from "/assets/mobile (4).svg";
import mob5 from "/assets/mobile (5).svg";
import logo from "/assets/fpback.svg";
import MobileSchedule from "./mobileSchedule";

const events = [
  {
    name: "INNOVENTURE",
    date: "March 4, 2025",
    description:
      "Innoventure is a business simulation event where participants navigate through complex situations which will help them to hone their abilities in decision making and strategic planning, while sharpening their analytical thinking.",
    url: "/events/event1/createTeam",
    img: "/assets/image (1).svg",
  },
  {
    name: "E-TALK",
    date: "March 5, 2025",
    description:
      "E-Talk brings together celebrated entrepreneurs to share their wisdom and expertise, inspiring the next generation of business builders. This engaging summit cultivates an energizing environment, leaving participants with the knowledge to pursue their entrepreneurial dreams with conviction. ",
    url: "/events/event2",
    img: "/assets/image (2).svg",
  },
  {
    name: "THE MARKETING EDGE",
    date: "March 6, 2025",
    description:
      "The Marketing Workshop equips participants with essential skills in branding, consumer behavior, and digital trends while providing practical insights to create impactful campaigns and optimize marketing effectiveness.",
    url: "/events/event3",
    img: "/assets/image (3).svg",
  },
  {
    name: "ACHIEVERS' CONCLAVE",
    date: "March 6, 2025",
    description:
      "At Achievers' Conclave, distinguished leaders and achievers from various fields reflect on the challenges they tackled and the invaluable lessons learnt. The event instills a sense of determination in participants to surpass their limits and achieve exceptional success.",
    url: "/events/event4",
    img: "/assets/image (4).svg",
  },
  {
    name: "PIONEIRA",
    date: "March 7, 2025",
    description:
      "Pioneira is a platform for new business ventures, offering startups an exceptional opportunity to pitch their ideas to industry leaders and influential personalities while embarking on a journey to withstand market competition and build connections.",
    url: "/events/pioneira/detailsForm",
    img: "/assets/image (5).svg",
  },
];

const images = [img1, img2, img3, img4, img5, img5];
const mobile = [mob1, mob2, mob3, mob4, mob5];
const limit = [Infinity, 1400, 800, 900, Infinity];

export default function Schedule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userCounts, setUserCounts] = useState<[number]>();
  const scrollThreshold = 200;
  const containerRef = useRef(null);
  const dateRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    userCount();
  }, []);

  useEffect(() => {
    if (mainRef.current) {
      const handleScroll = (event: WheelEvent) => {
        event.preventDefault();
        if (event.deltaY < 0 && activeIndex <= 0) {
          window.scrollTo({
            top: document.getElementById("scroll")?.offsetTop,
            behavior: "smooth",
          });
        }
        if (event.deltaY > 0 && activeIndex >= events.length - 1) {
          window.scrollTo({
            top: document.getElementById("speakers")?.offsetTop,
            behavior: "smooth",
          });
        }
        setScrollDelta((prevDelta) => prevDelta + event.deltaY);
        if (Math.abs(scrollDelta) >= scrollThreshold) {
          if (event.deltaY > 0 && activeIndex < events.length - 1) {
            setActiveIndex((prev) => prev + 1);
          } else if (event.deltaY > 0 && activeIndex === events.length - 1) {
            window.scrollTo({
              top: document.getElementById("speakers")?.offsetTop,
              behavior: "smooth",
            });
          } else if (event.deltaY < 0 && activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
          } else if (event.deltaY < 0 && activeIndex === 0) {
            window.scrollTo({
              top: document.getElementById("scroll")?.offsetTop,
              behavior: "smooth",
            });
          }
          setScrollDelta(0);
        }
      };
      mainRef.current.addEventListener("wheel", handleScroll, {
        passive: false,
      });
      return () => {
        if (mainRef.current) {
          mainRef.current.removeEventListener("wheel", handleScroll);
        }
      };
    }
  }, [activeIndex, scrollDelta]);

  useEffect(() => {
    if (containerRef.current) {
      const yOffset = -activeIndex * (100 / 3);
      gsap.to(containerRef.current, {
        y: `${yOffset}%`,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      dateRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2"
    );
    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3 },
      "-=0.2"
    );
    return () => {
      tl.kill();
    };
  }, [activeIndex]);

  const router = useRouter();
  const { data: session, update } = useSession();
  const userEmail = session?.user?.email || "";
  const hasRegisteredPioneira = session?.user?.events?.includes(5);

  const userCount = async()=>{
    setIsLoading(true);
    try {
      const response = await axios.get("/api/eventRegistration/userCount");
      console.log("API Response:", response.data);
      if (response.status === 200) {
        setUserCounts(response.data.data);
        console.log("User count fetched successfully",response.data.data);
      }
    } catch (error) {
      console.log("Error fetching user count:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRedirect = async (event: number) => {
    setIsLoading(true);
    if (!userEmail) {
      signIn("google");
      setIsLoading(false);
      return;
    }
    if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("VIT'V students can't register for this event");
      setIsLoading(false);
      return;
    }
    if (event >= 1 && event <= 4 && !userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("Use your college email ID (@vitstudent.ac.in) to register");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post("/api/eventRegistration/register", {
        event,
      });
      console.log("API Response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events || [];
        newUserEvents.push(event);
        if (event === 5) {
          newUserEvents.push(2);
          newUserEvents.push(4);
        }
        await update({
          ...session,
          user: { ...session?.user, events: newUserEvents },
        });

        router.push(
          event === 1 ? `/events/event${event}/createTeam` : "/#timeline"
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log("Registration error:", axiosError.response?.data);

      if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        if (event === 5) {
          router.push("/events/pioneira/detailsForm");
          return;
        }
        router.push("/userDetails");
        return;
      }
      toast.error("An error occurred while registering.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeregister = async (event: Number | null) => {
    setIsLoading(true);
    try {
      console.log("Deregistering event:", event);
      const response = await axios.post("/api/eventRegistration/deregister", {
        event: Number(event),
      });
      console.log("API Response:", response);

      if (response.status === 201 || response.status === 202) {
        toast.success(response.data.message);
        if (event === 5) {
          await update({
            ...session,
            user: { ...session?.user, events: [], hasFilledDetails: false },
          });
        } else {
          const newUserEvents = session?.user.events?.filter(
            (e) => e !== event
          );
          await update({
            ...session,
            user: { ...session?.user, events: newUserEvents },
          });
        }
        router.push("/#timeline");
      } else {
        throw new Error("Error processing event deregistration");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log("Deregistration error:", axiosError);
      if (axiosError.response?.status === 403) {
        toast.error("Please leave your team before deregistering.");
      } else if (axiosError.response?.status === 401) {
        toast.error("Please fill out your details first");
        router.push("/userDetails");
      } else {
        toast.error("An error occurred while deregistering.");
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const gradientStyle =
    "linear-gradient(180deg, #6F0F0F 3.67%, #C72423 38.67%, #981B1B 65.67%, #510D0D 100%)";
  return (
    <div id="timeline">
      <MobileSchedule images={mobile} />
      <div className="hidden md:block">
          <Image 
            src={logo} 
            alt="logo" 
            className="absolute h-full opacity-50 z-0"
          />
        <div className=" flex h-screen bg-white" ref={mainRef}>
          {/* Left Section */}
          <div className="w-2/3 flex flex-col pl-10 pr-4 py-auto relative">
            {/* Navigation Bar */}
            <div className="relative">
              <h2
                className="text-5xl font-bold my-6 font-[GreaterTheory]"
                style={{
                  background: gradientStyle,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SCHEDULE
              </h2>
              <div className="absolute left-1 bottom-2 w-2 bg-gray-300 h-[52%]"></div>
              <ul className="space-y-1 relative font-[PoppinsRegular] z-10">
                {events.map((event, idx) => (
                  <li
                    key={idx}
                    className="relative flex items-center cursor-pointer text-xl"
                  >
                    {activeIndex === idx && (
                      <div
                        className="absolute left-0 w-4 h-full"
                        style={{ background: gradientStyle }}
                        onClick={() => setActiveIndex(idx)}
                      ></div>
                    )}
                    <span
                      className={`pl-8 ${activeIndex === idx
                          ? "text-black font-bold"
                          : "text-gray-400 hover:text-black"
                        }`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      {event.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event Details */}
            <div className="flex flex-col items-start mt-10 gap-4 z-10">
              <p
                ref={dateRef}
                className="text-2xl font-black text-black font-[GreaterTheory]"
              >
                {events[activeIndex]?.date}
              </p>
              <h3
                ref={nameRef}
                className="text-5xl font-bold font-[GreaterTheory]"
                style={{
                  background: gradientStyle,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {events[activeIndex]?.name}
              </h3>
              <p
                ref={descriptionRef}
                className="text-lg text-gray-700 pr-36 font-[PoppinsRegular]"
              >
                {events[activeIndex]?.description}
              </p>
              {!hasRegisteredPioneira ? (
                <div className="flex flex-row gap-2">
                    { activeIndex!=0  && 
                userCounts && userCounts[activeIndex] >= limit[activeIndex] ? (
                  session?.user?.events?.includes(activeIndex + 1) ? (
                    <button
                      key={activeIndex + 1}
                      className="text-white flex px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
                      style={{ background: gradientStyle }}
                      onClick={() => handleDeregister(activeIndex + 1)}
                    >
                      Deregister
                    </button>
                  ) : (
                    <button
                      key={activeIndex + 1}
                      className="text-white flex px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
                      style={{ background: gradientStyle }}
                      onClick={() => toast.error("Registration limit reached")}
                    >
                      Registration Closed
                    </button>
                  )
                ) : (
                  <button
                    key={activeIndex + 1}
                    className="text-white flex px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
                    style={{ background: gradientStyle }}
                    // onClick={() => }
                    onClick={() =>{
                      
                      session?.user.events?.includes(activeIndex + 1)
                        ? handleDeregister(activeIndex + 1)
                        : activeIndex===0 ? toast.error("Registrations are closed"):handleRedirect(activeIndex + 1)}
                    }
                  >
                    {isLoading ? (
                      <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>

                    ) : session?.user.events?.includes(activeIndex + 1) ? (
                      "Deregister"
                    ) : (
                      activeIndex===0 ?"Registration Closed":"Register"
                    )}
                  </button>
                )}
                  

                  {activeIndex === 0 && session?.user.events?.includes(1) && (
                    <button
                      key={activeIndex}
                      className="text-white flex px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
                      style={{ background: gradientStyle }}
                      // onClick={() => }
                      onClick={() => {
                        setIsLoading(true);
                        session?.user.event1TeamRole === null ? router.push('/events/event1/createTeam') : (
                          session?.user.event1TeamRole === 0 ? router.push('/events/event1/leaderDashboard') :
                            router.push('/events/event1/memberDashboard'))
                      }

                      }
                    >
                      {isLoading ? (
                        <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>

                      ) : session?.user.event1TeamRole === null ? (
                        "Create Team"
                      ) : (
                        "Dashboard"
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  key={activeIndex + 1}
                  className="flex text-white px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
                  style={{ background: gradientStyle }}
                  onClick={() =>
                    session?.user.events?.includes(activeIndex + 1)
                      ? toast.error("You cannot register again")
                      : handleRedirect(activeIndex + 1)
                  }
                >
                  {isLoading ? (
                    <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : session?.user.events?.includes(activeIndex + 1) ? (
                    "Registered"
                  ) : (
                    "Register"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/3 relative overflow-hidden mr-16 h-full z-5">
            <div
              ref={containerRef}
              className="absolute top-0 left-0 w-full h-[300%] transition-transform duration-500"
            >
              {images.map((image, idx) => {
                const imagePosition = idx - activeIndex;
                let opacity = 1;
                let scale = 1;
                let zIndex = 0;
                if (imagePosition <= 2) {
                  opacity = 1;
                  scale = 1;
                  zIndex = 1;
                } else if (Math.abs(imagePosition) > 2) {
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className="relative w-full h-1/3 flex justify-center items-center overflow-hidden"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: opacity,
                        transform: `scale(${scale})`,
                        transition: "opacity 0.3s, transform 0.3s",
                        zIndex: zIndex,
                      }}
                    >
                      <Image
                        src={image}
                        alt={`Event ${idx + 1}`}
                        layout="fill"
                        objectFit="fit"
                        style={{ transition: "opacity 0.3s" }}
                      />
                      <Image
                        src={image}
                        alt={`Event ${idx + 1}`}
                        layout="fill"
                        objectFit="fit"
                        style={{ transition: "opacity 0.3s" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
}
//registrations closed