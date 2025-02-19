"use client";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/footer";
import Marq from "@/components/marquee";
import NavBar from "@/components/navbar";
import EventButtons from "@/components/EventButton";
import RegistrationButtons from "@/components/registrationButton";
import CustomCursor from "@/components/cursor";
import SignInBtn from "@/components/signinButton";
import MeetOurSpeakers from "@/components/meetOurSpeakers";
import Sponsors from "@/components/sponsors";
import FaqContent from "@/components/faq";
import Scroll from "@/components/scroll";
import About from "@/components/about";
import Schedule from "@/components/schedule";
import Timeline from "@/components/timeline";
import EsummitMotion from "@/components/EsummitMotion";
import IdeateComponent from "@/components/iiaMotion";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LampDemo } from "@/components/ui/lamp";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


export default function HomePage() {
  const [ideateCompleted, setIdeateCompleted] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#faq",
      start: "top bottom",
      onEnter: () => document.body.classList.add("faq-visible"),
      onLeaveBack: () => document.body.classList.remove("faq-visible"),
    });
  }, []);

  return (
    <div className={ideateCompleted ? "page-container" : "overflow-hidden h-screen w-screen"}>
  {!ideateCompleted && <IdeateComponent onComplete={() => setIdeateCompleted(true)} />}
  {ideateCompleted && (
    <>
        <NavBar bgColor="black" />
        <LampDemo/>
        <About />
        <Scroll />
        <Timeline /> 
        <MeetOurSpeakers />
        <Sponsors />
        <FaqContent />
        <Footer />
      </>
  )}
</div>


  );
}
