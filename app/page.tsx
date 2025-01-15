// pages/index.tsx or any page
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/footer";
import Marq from "@/components/marquee";
import NavBar from "@/components/navbar"
import Marquee from "react-fast-marquee";

export default function HomePage() {
  return (
    <div>
      <NavBar/>
      <Marq/>
      <Footer/>
    
    </div>
  );
}