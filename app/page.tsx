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
import EsummitMotion from "@/components/EsummitMotion";
import IdeateComponent from "@/components/iiaMotion";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [ideateCompleted, setIdeateCompleted] = useState(false);
  return (
    <div>
    <CustomCursor /> 
    {!ideateCompleted && <IdeateComponent onComplete={() => setIdeateCompleted(true)} />}
    {ideateCompleted && (
        <>
          <SignInBtn />
          <RegistrationButtons
            eventUrls={{
              1: "/events/event1/createTeam",
              2: "/events/event2",
              3: "/events/event3",
              4: "/events/event4",
              5: "/events/event5",
            }}
          />
          <EsummitMotion />
          <MeetOurSpeakers />
          <Sponsors />
          <FaqContent />
          <Footer />
        </>
      )}
    </div>
  );
}