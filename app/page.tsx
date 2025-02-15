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
import Timeline from "@/components/timeline";
import EsummitMotion from "@/components/EsummitMotion";
import IdeateComponent from "@/components/iiaMotion";
import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import RegisterBtn from "@/components/registernowButton";

export default function HomePage() {
  const [ideateCompleted, setIdeateCompleted] = useState(false);
  return (
    <div>
    <CustomCursor /> 
    {!ideateCompleted && <IdeateComponent onComplete={() => setIdeateCompleted(true)} />}
    {ideateCompleted && (
        <>
          <NavBar />
          <RegisterBtn/>
          <EsummitMotion />
          <MeetOurSpeakers />
          <Sponsors />
          <Timeline />
          <FaqContent />
          <Footer />
        </>
      )}
    </div>
  );
}