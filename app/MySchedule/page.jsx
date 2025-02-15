"use client";
import scheduleDetails from "@/components/scheduleDetails";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ScheduleRegisterButton from "@/components/events/ScheduleRegisterButton";
import Loader from "@/components/loader";
import background from "/assets/bg.png"
import axios, { AxiosError } from "axios";
import Event from "./event";

// const page = () =>
const loader=false;
const MySchedule = () => {
  const [regEvent, setRegEvents] = useState([]);
  const [regEventsList, setRegEventsList] = useState([]);
  const [userDetails, setUserDeatials] = useState(null);
//   const [loader, setLoader] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    // setLoader(true);
    getData();
  }, []);

  const getData= async ()=>{
   const data=await axios.get("/api/user/getUserDetails")
   console.log("bcjbjhdwdkwkdhjhwkd",data.data.user);
        setUserDeatials(data.data.user);
        setRegEventsList(
          scheduleDetails.filter((event) =>
            data.data.user.events?.includes(event.id)
          )
        
        );
        // setLoader(false);
        console.log(regEventsList);
      }

  const events = regEventsList.map((event) => {
    return <Event key={event.id} event={event} userDetails={userDetails}/>;
  });

  return (
    <section className="bg-cover bg-center items-center-20 text-white min-h-screen bg-[#0E0E0E] font-poppins px-10 sm:px-16 md:px-20"   style={{ backgroundImage: `url(${background.src})` }}>
      {loader ? (
       <div></div>
      ) : userDetails?.user?.events.length === 0 ||
        status === "unauthenticated" ? (
        <div className="flex flex-col min-h-[calc(100vh-5rem)] gap-10 items-center justify-center">
          <h1 className="text-2xl md:text-4xl lg:text-6xl capitalize">
            No events registered
          </h1>
          <button
            className="py-2 px-4 font-semibold rounded-xl font-poppins uppercase border-4 border-[#FEFAB7] bg-transparent hover:scale-105 transition-all"
            onClick={() => {
              window.location.href = "/#schedule";
            }}
          >
            Register Now
          </button>
        </div>
      ) : (
        <>
          <h1 className="pt-20 uppercase text-center mt-10 mb-5 text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#E0E0E0]
 bg-clip-text text-transparent">
            my schedule
          </h1>
          <div className="flex flex-col gap-10 pb-10">{events}</div>
        </>
      )}
    </section>
  );
};

export default MySchedule;