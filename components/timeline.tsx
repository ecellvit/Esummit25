"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import img0 from "/assets/image (1).jpg";
import img1 from "/assets/image (1).jpg";
import img2 from "/assets/image (2).jpg";
import img3 from "/assets/image (3).jpg";
import img4 from "/assets/image (4).jpg";
import img5 from "/assets/image (5).jpg";
import img6 from "/assets/image (6).jpg";
import logo from "/assets/fpback.svg";
import MobileSchedule from "./mobileSchedule";

const events = [
  {
    name: "INNOVENTURE",
    date: "COMING SOON!!",
    description:
      "Innoventure is a business simulation event where participants navigate through complex business situations while honing their abilities in product creation and business strategy which will sharpen the participants analytical thinking.",
    url: "/events/event1/createTeam",
  },
  {
    name: "E TALK",
    date: "COMING SOON!!",
    description:
      "E-Talk brings together celebrated entrepreneurs to share their wisdom and expertise, inspiring the next generation of business builders. This engaging summit cultivates an energizing environment, leaving participants with the knowledge to pursue their entrepreneurial dreams with conviction.",
    url: "/events/event2",
  },
  {
    name: "MARKETING WORKSHOP",
    date: "COMING SOON!!",
    description:
      "The Marketing Workshop equips participants with essential skills in branding, consumer behavior, and digital trends while providing practical insights to create impactful campaigns and optimize marketing effectiveness.",
      url: "/events/event3",
  },
  {
    name: "ACHIEVERS CONCLAVE",
    date: "COMING SOON!!",
    description:
      "At Achievers’ Conclave, distinguished leaders and achievers from various fields reflect on the challenges they tackled and the invaluable lessons learnt. The event instills a sense of determination in participants to surpass their limits and achieve exceptional success.",
    url: "/events/event4",
  },
  {
    name: "PIONEIRA PHASE 2",
    date: "COMING SOON!!",
    description:
      "Pioneira is a major platform for new business ventures, offering startups an exceptional opportunity to pitch their ideas to industry leaders and influential personalities while embarking on a journey to withstand market competition, and build connections.",
    url: "/events/pioneira/detailsForm",
  },
];

const images = [img0, img1, img2, img3, img4, img5, img6];

export default function Schedule() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDelta, setScrollDelta] = useState(0);
  const scrollThreshold = 100;
  const containerRef = useRef(null);
  const dateRef = useRef(null);
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const mainRef = useRef<HTMLDivElement | null>(null);

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
      mainRef.current.addEventListener("wheel", handleScroll, { passive: false });
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
    tl.fromTo(dateRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
    tl.fromTo(nameRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
    tl.fromTo(descriptionRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [activeIndex]);

  const router = useRouter();
  const { data: session, update } = useSession();
  const userEmail = session?.user?.email || "";
  const handleRedirect = async (event: number) => {
    if (!userEmail) {
      signIn("google");
      return;
    }
    if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("VIT'V students can't register for this event");
      return;
    }
    if (event >= 1 && event <= 4 && !userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("Use your college email ID (@vitstudent.ac.in) to register");
      return;
    }
    try {
      const response = await axios.post("/api/eventRegistration/register", { event });
      console.log("API Response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events || [];
        newUserEvents.push(event);
        if (event === 5) {
          newUserEvents.push(2);
          newUserEvents.push(4);
        }
        await update({ ...session, user: { ...session?.user, events: newUserEvents } });

        router.push(event === 1 ? `/events/event${event}/createTeam` : "/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log("Registration error:", axiosError.response?.data);

      if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        if (event === 5) {
          router.push('/events/pioneira/detailsForm');
          return;
        }
        router.push('/userDetails');
        return;
      }
      toast.error("An error occurred while registering.");
    }
  };

  const handleDeregister = async (event: Number | null) => {
    try {
        console.log("Deregistering event:", event);
        const response = await axios.post("/api/eventRegistration/deregister", { event : Number(event) });
        console.log("API Response:", response);

        if (response.status === 201 || response.status === 202) {
            toast.success(response.data.message);
            if (event === 5) {
              await update({ ...session, user: { ...session?.user, events: [], hasFilledDetails: false } });
            } else {
              const newUserEvents = session?.user.events?.filter(e => e !== event);
              await update({ ...session, user: { ...session?.user, events: newUserEvents } });
            }
            router.push('/');
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
            router.push('/userDetails');
        } else {
            toast.error("An error occurred while deregistering.");
            console.log(error);
        }
    }
  };

  const gradientStyle = "linear-gradient(180deg, #6F0F0F 3.67%, #C72423 38.67%, #981B1B 65.67%, #510D0D 100%)";
  return (
    <div id="timeline">
    <MobileSchedule images={images} />
    <div className="hidden md:block">
    <div className=" flex h-screen bg-white" ref={mainRef}>
      {/* Left Section */}
      <div className="w-2/3 flex flex-col pl-10 pr-4 py-auto relative">
        {/* Navigation Bar */}
        <div className="relative">
          <h2
            className="text-5xl font-bold my-6 font-[BrigendsExpanded]"
            style={{
              background: gradientStyle,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SCHEDULE
          </h2>
          <div className="absolute left-1 bottom-2 w-2 bg-gray-300 h-[52%]"></div>
          <ul className="space-y-1 relative font-[PoppinsRegular]">
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
                  className={`pl-8 ${
                    activeIndex === idx
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
        <div className="flex flex-col items-start mt-10 gap-4">
          <p ref={dateRef} className="text-2xl font-black text-black font-[GreaterTheory]">
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
          <p ref={descriptionRef} className="text-lg text-gray-700 pr-36 font-[PoppinsRegular]">
            {events[activeIndex]?.description}
          </p>
          <button
            key={activeIndex+1}
            className="text-white px-8 py-2 mt-2 border-[#D22121] border-solid border-4 rounded-md text-lg font-[GreaterTheory] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-110 active:shadow-[0_0_15px_#D22121]"
            style={{ background: gradientStyle }}
            // onClick={() => }
            onClick={() => session?.user.events?.includes(activeIndex+1) ? handleDeregister(activeIndex+1) : handleRedirect(activeIndex+1)}
          >
            {session?.user.events?.includes(activeIndex+1) ? "Deregister" : "Register"}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/3 relative overflow-hidden mr-16 h-full">
        <div
          ref={containerRef}
          className="absolute top-0 left-0 w-full h-[300%]  transition-transform duration-500"
        >
          {images.map((image, idx) => {
            const imagePosition = idx - activeIndex;
            let opacity = 0.6;
            let scale = 1;
            let zIndex = 0;

            if (imagePosition === 0) {
              opacity = 1;
              scale = 1.05;
              zIndex = 1;
            } else if (Math.abs(imagePosition) === 1) {
              opacity = 0.8;
              scale = 1;
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
                    objectFit="cover"
                    style={{ transition: "opacity 0.3s" }}
                  />
                  <Image
                    src={image}
                    alt={`Event ${idx + 1}`}
                    layout="fill"
                    objectFit="cover"
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