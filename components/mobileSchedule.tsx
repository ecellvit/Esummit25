import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

interface Event {
  name: string;
  date: string;
  description: string;
  url: string;
}

interface Session {
  user: {
    email: string;
    events: number[];
  };
}

const events = [
  {
    name: "INNOVENTURE",
    date: "March 4, 2025",
    description:
      "Innoventure is a business simulation event where participants navigate through complex business situations while honing their abilities in product creation and business strategy which will sharpen the participants analytical thinking.",
    url: "/events/event1/createTeam",
  },
  {
    name: "E TALK",
    date: "March 5, 2025",
    description:
      "E-Talk brings together celebrated entrepreneurs to share their wisdom and expertise, inspiring the next generation of business builders. This engaging summit cultivates an energizing environment, leaving participants with the knowledge to pursue their entrepreneurial dreams with conviction.",
    url: "/events/event2",
  },
  {
    name: "MARKETING WORKSHOP",
    date: "March 6, 2025",
    description:
      "The Marketing Workshop equips participants with essential skills in branding, consumer behavior, and digital trends while providing practical insights to create impactful campaigns and optimize marketing effectiveness.",
    url: "/events/event3",
  },
  {
    name: "ACHIEVERS CONCLAVE",
    date: "March 6, 2025",
    description:
      "At Achievers’ Conclave, distinguished leaders and achievers from various fields reflect on the challenges they tackled and the invaluable lessons learnt. The event instills a sense of determination in participants to surpass their limits and achieve exceptional success.",
    url: "/events/event4",
  },
  {
    name: "PIONEIRA",
    date: "March 7, 2025",
    description:
      "Pioneira is a major platform for new business ventures, offering startups an exceptional opportunity to pitch their ideas to industry leaders and influential personalities while embarking on a journey to withstand market competition, and build connections.",
    url: "/events/event5",
  },
];

const MobileSchedule = ({ images }: { images: any[] }) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const userEmail = session?.user?.email || "";
  const hasRegisteredPioneira = session?.user?.events?.includes(5);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const handleRedirect = async (event: number): Promise<void> => {
    setIsLoading(true);
    if (!userEmail) {
      signIn("google");
      setIsLoading(false);
      return;
    }
    if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("VIT students can't register for this event");
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

  const handleDeregister = async (event: number): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/eventRegistration/deregister", {
        event: Number(event),
      });

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
      if (axiosError.response?.status === 403) {
        toast.error("Please leave your team before deregistering.");
      } else if (axiosError.response?.status === 401) {
        toast.error("Please fill out your details first");
        router.push("/userDetails");
      } else {
        toast.error("An error occurred while deregistering.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const gradientStyle =
    "linear-gradient(180deg, #6F0F0F 3.67%, #C72423 38.67%, #981B1B 65.67%, #510D0D 100%)";

  return (
    <div className="md:hidden bg-white w-full">
      <div className="px-4 py-6 w-full">
        <h2
          className="text-4xl font-bold mb-6"
        >
          SCHEDULE
        </h2>

        <div className="space-y-6 bg-white w-full">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="relative rounded-lg w-full overflow-hidden min-h-[400px] bg-white"
            >
              {/* Background Image with Blur */}
              <div className="absolute inset-0">
                <Image
                  src={images[idx]}
                  alt={event.name}
                  layout="fill"
                  objectFit="cover"
                  className="filter brightness-75"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="text-white">
                  <p className="text-lg font-bold mb-2">{event.date}</p>
                  <h3 className="text-3xl font-bold mb-4">{event.name}</h3>
                  <p className="text-sm mb-6 text-justify">{event.description}</p>
                  {!hasRegisteredPioneira ? (
                    <div>
                      <button
                        className="w-full flex justify-center bg-white text-red-800 px-6 py-3 rounded-md text-lg font-bold 
                              transition-all duration-300 ease-in-out transform hover:scale-105 
                              active:scale-110 active:shadow-lg border-2 border-red-800"
                        onClick={() =>
                          session?.user.events?.includes(idx + 1)
                            ? handleDeregister(idx + 1)
                            : handleRedirect(idx + 1)
                        }
                      >
                        {isLoading ? (
                          <span className="w-6 h-6 border-4 border-red-800 border-t-white rounded-full animate-spin"></span>
                        ) : session?.user.events?.includes(idx + 1) ? (
                          "Deregister"
                        ) : (
                          "Register"
                        )}
                      </button>

                      {idx === 0 && session?.user.events?.includes(1) && (
                        <button
                          className="w-full flex justify-center bg-white text-red-800 px-6 py-3 rounded-md text-lg font-bold 
                             transition-all duration-300 ease-in-out transform hover:scale-105 
                             active:scale-110 active:shadow-lg border-2 border-red-800"
                          onClick={() => {
                            setIsLoading(true);

                            session?.user.event1TeamRole === null
                              ? router.push("/events/event1/createTeam")
                              : session?.user.event1TeamRole === 0
                              ? router.push("/events/event1/leaderDashboard")
                              : router.push("/events/event1/memberDashboard");
                          }}
                        >
                          {isLoading ? (
                            <span className="w-6 h-6 border-4 border-red-800 border-t-white rounded-full animate-spin"></span>
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
                      key={idx + 1}
                      className="w-full flex justify-center bg-white text-red-800 px-6 py-3 rounded-md text-lg font-bold 
                              transition-all duration-300 ease-in-out transform hover:scale-105 
                              active:scale-110 active:shadow-lg border-2 border-red-800"
                      onClick={() =>
                        session?.user.events?.includes(idx + 1)
                          ? toast.error("You cannot register again")
                          : handleRedirect(idx + 1)
                      }
                    >
                      {isLoading ? (
                        <span className="w-6 h-6 border-4 border-red-800 border-t-white rounded-full animate-spin"></span>
                      ) : session?.user.events?.includes(idx + 1) ? (
                        "Registered"
                      ) : (
                        "Register"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MobileSchedule;
