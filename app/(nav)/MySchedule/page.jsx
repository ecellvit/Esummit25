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
const MySchedule = () => {
  const [regEvent, setRegEvents] = useState([]);
  const [regEventsList, setRegEventsList] = useState([]);
  const [userDetails, setUserDeatials] = useState(null);
  
  const [loader, setLoader] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {

    
    getData();
   
  }, []);

  const getData= async ()=>{
    setLoader(true);
   const data=await axios.get("/api/user/getUserDetails")
   console.log("bcjbjhdwdkwkdhjhwkd",data.data.user);
        setUserDeatials(data.data.user);
        setRegEventsList(
          scheduleDetails.filter((event) =>
            data.data.user.events?.includes(event.id)
          )
         
        );
        setLoader(false);
      }

  const events = regEventsList.map((event) => {
    return <Event key={event.id} event={event} userDetails={userDetails}/>;
  });

  return (
    <section className="bg-cover bg-center items-center-20 text-white min-h-screen bg-[#0E0E0E] font-poppins px-10 sm:px-16 md:px-20"   style={{ backgroundImage: `url(${background.src})` }}>
      {loader ? (
       <Loader></Loader>
      ) : userDetails?.events.length === 0 ||
        status === "unauthenticated"? (
        <div className="flex flex-col min-h-[calc(100vh-5rem)] gap-10 items-center justify-center">
          <h1 className="text-xl md:text-3xl lg:text-5xl capitalize font-[BrigendsExpanded]">
            No events registered
          </h1>
          <button
            className="py-2 px-4 font-semibold rounded-xl font-[GreaterTheory] uppercase border-4 border-red-400 bg-transparent hover:scale-105 transition-all"
            onClick={() => {
              console.log("fbjhwfkhwdkj",userDetails);
              if(userDetails.hasFilledDetails === false){
                window.location.href = "/userDetails";
              }
              else{
                window.location.href = "/#schedule";
              }
             
            }}
          >
            Register Now
          </button>
        </div>
      ) : (
        <>
          <h1 className="pt-14 uppercase text-center font-[BrigendsExpanded] mt-9 mb-8 text-4xl md:text-5xl lg:text-7xl bg-gradient-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#E0E0E0]
 bg-clip-text text-transparent">
            my schedule
          </h1>
          <div className="flex flex-col gap-10 pb-10 ">{events}</div>
        </>
      )}
    </section>
  );
};

export default MySchedule; 