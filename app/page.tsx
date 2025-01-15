// pages/index.tsx or any page
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/footer";
import Marq from "@/components/marquee";
import NavBar from "@/components/navbar";

export default function HomePage() {
  return (
    <div>
      <NavBar />
      <Marq speed1={100} speed2={50} speed3={75} speed4={120} />
      <Footer />
    </div>
  );
}
