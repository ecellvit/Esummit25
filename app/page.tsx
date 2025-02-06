import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/footer";
import Marq from "@/components/marquee";
import NavBar from "@/components/navbar";
import EventButtons from "@/components/EventButton";
import CustomCursor from "@/components/cursor";

export default function HomePage() {
  return (
    <div>
      <CustomCursor />
      <NavBar />
      <EventButtons
        eventUrls={{
          1: "/events/event1/Join_and_Create_Team", 
          2: "/events/event2", 
          3: "/events/event3", 
          4: "/events/event4", 
          5: "/events/event5", 
        }}
      />
      <Marq speed1={100} speed2={50} speed3={75} speed4={120} />
      <Footer />
    </div>
  );
}
