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
    date: "March 4",
    description:
      "Innoventure is a dynamic business simulation event where participants tackle real-world challenges, honing their problem-solving skills through hands-on experience in product development, business analysis, and entrepreneurial strategy .",
    url: "/events/event1/createTeam",
  },
  {
    name: "E TALK",
    date: "March 5",
    description:
      "E-Talk brings together renowned entrepreneurs to offer valuable lessons and inspiration through engaging discussions and influential motivational speeches for emerging entrepreneurs.",
    url: "/events/event2",
  },
  {
    name: "MARKETING WORKSHOP",
    date: "March 6",
    description:
      "The Marketing Workshop equips participants with essential skills in branding, consumer behavior, and digital trends while providing practical insights to create impactful campaigns and optimize marketing effectiveness.",
    url: "/events/event3",
  },
  {
    name: "ACHIEVERS CONCLAVE",
    date: "March 6",
    description:
      "At Achiever’s Conclave, accomplished industry stalwarts from diverse fields come together to share their journeys, insights, and success strategies to inspire and empower participants to scale new heights in their endeavors.",
    url: "/events/event4",
  },
  {
    name: "PIONEIRA PHASE 2",
    date: "March 7",
    description:
      "Pioneira, a conclave for startups to pitch their ideas to industry leaders and prominent personalities while embarking on a journey to gain exposure, withstand market competition, and build connections.",
    url: "/events/event5",
  },
];

const MobileSchedule = ({ images }: { images: any[] }) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const userEmail = session?.user?.email || "";

  const handleRedirect = async (event: number): Promise<void> => {
    if (!userEmail) {
      signIn("google");
      return;
    }
    if (event === 5 && userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("VIT students can't register for this event");
      return;
    }
    if (event >= 1 && event <= 4 && !userEmail.endsWith("@vitstudent.ac.in")) {
      toast.error("Use your college email ID (@vitstudent.ac.in) to register");
      return;
    }
    try {
      const response = await axios.post("/api/eventRegistration/register", { event });
      if (response.status === 200) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events || [];
        newUserEvents.push(event);
        await update({ ...session, user: { ...session?.user, events: newUserEvents } });
        router.push(event === 1 ? `/events/event${event}/createTeam` : "/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 402) {
        toast.error("Please fill out your details first");
        return;
      }
      toast.error("An error occurred while registering.");
    }
  };

  const handleDeregister = async (event: number): Promise<void> => {
    try {
      const response = await axios.post("/api/eventRegistration/deregister", { event: Number(event) });
      if (response.status === 201 || response.status === 202) {
        toast.success(response.data.message);
        const newUserEvents = session?.user.events?.filter(e => e !== event);
        await update({ ...session, user: { ...session?.user, events: newUserEvents } });
        router.push('/');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        toast.error("Please leave your team before deregistering.");
      } else if (axiosError.response?.status === 401) {
        toast.error("Please fill out your details first");
        router.push('/userDetails');
      } else {
        toast.error("An error occurred while deregistering.");
      }
    }
  };

  const gradientStyle = "linear-gradient(180deg, #6F0F0F 3.67%, #C72423 38.67%, #981B1B 65.67%, #510D0D 100%)";

  return (
    <div className="md:hidden bg-white w-full">
      <div className="px-4 py-6 w-full">
        <h2
          className="text-4xl font-bold mb-6"
          style={{
            background: gradientStyle,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
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
                  className="filter blur-sm brightness-50"
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="text-white">
                  <p className="text-xl font-bold mb-2">{event.date}</p>
                  <h3 className="text-3xl font-bold mb-4">{event.name}</h3>
                  <p className="text-sm mb-6">{event.description}</p>
                  
                  <button
                    className="w-full bg-white text-red-800 px-6 py-3 rounded-md text-lg font-bold 
                             transition-all duration-300 ease-in-out transform hover:scale-105 
                             active:scale-110 active:shadow-lg border-2 border-red-800"
                    onClick={() => session?.user.events?.includes(idx + 1) 
                      ? handleDeregister(idx + 1) 
                      : handleRedirect(idx + 1)}
                  >
                    {session?.user.events?.includes(idx + 1) ? "Deregister" : "Register"}
                  </button>
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