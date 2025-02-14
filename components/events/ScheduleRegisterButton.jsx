"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";

const ScheduleRegisterButton = ({
  event,
  token,
  loader,
  setLoader,
  setEvent1Reg,
  setEvent2Reg,
}) => {
  const [userDetails, setUserDeatials] = useState(null);
  const [eventRegistered, setEventRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
   getData();
  }, []);
  const getData= async ()=>{
    const data=await axios.get("/api/user/getUserDetails")
    console.log("bcjbjhdwdkwkdhjhwkd",data.data.user);
         setUserDeatials(data.data.user);
         if (data.data.user.events) {
            if (data.data.user.events.includes(event)) {
              setEventRegistered(true);
            }
          }
         // setLoader(false);
         console.log(userDetails);
       }
  const deregisterEvent = () => {
    if (!token) {
      signIn("google");

      return;
    }
    if (!userDetails.hasFilledDetails) {
      router.push("/userDetails");
      return;
    }
    setLoader(true);
    fetch(`/api/event${event}/deregister`, {
      content: "application/json",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        setLoader(false);
        if (res.status === 200) {
          setLoading(false);
          setEventRegistered(false);
          toast.success("Event Deregistered Successfully.");
          location.reload();
          // if (event === 1 || event === 2) location.reload();
        } else if (res.status === 400) {
          toast.error("Delete the existing Team first");
        }
      })
      .catch((err) => {
        setLoader(false);
        toast.error("Something went wrong.");
      });
  };
  return (
    <>
      <Toaster />
      <button
        className="text-black font-poppins font-semibold hover:scale-105 transition-all bg-gradient-to-br from-[#DCA64E] via-[#FEFAB7] to-[#D6993F] p-2 rounded-lg hover:bg-opacity-80"
        disabled={loading || loader}
        onClick={() => {
          deregisterEvent();
        }}
      >
        {loading || !userDetails
          ? "loading..."
          : eventRegistered
          ? "Deregister"
          : "Register"}
      </button>
    </>
  );
};

export default ScheduleRegisterButton;