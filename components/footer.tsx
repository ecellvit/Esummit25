import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import Link from "next/link";

export default function Footer() {
  const [value, setValue] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full bg-gradient-to-t from-[#1C0000] to-[#6F0F0F] shadow-md bottom-0 left-0 h-[80vh] pt-10 flex flex-col justify-between">
  {/* Background text section */}
  <div className="flex-grow flex items-end justify-center mb-4">
    <div className="flex flex-col leading-[0.65] p-0 m-0">
      <h1 className="text-[9vw] text-[rgba(17,17,17,0.13)] font-[GreaterTheory] font-bold tracking-widest p-0 m-0 leading-[0.74]">
        E-SUMMIT'25
      </h1>
      <h1 className="text-[9vw] text-[rgba(17,17,17,0.3)] font-[GreaterTheory] font-bold tracking-widest p-0 m-0 leading-[0.74]">
        E-SUMMIT'25
      </h1>
      <h1 className="text-[9vw] text-[rgba(32,7,7,1)] font-[GreaterTheory] font-bold tracking-widest p-0 m-0 leading-[0.74]">
        E-SUMMIT'25
      </h1>
      <h1 className="text-[9vw] text-white font-[GreaterTheory] text-center font-bold tracking-widest p-0 m-0 leading-[0.74]">
        E-SUMMIT'25
      </h1>
      <div className="h-[1px] w-full mt-8 bg-white"></div>
    </div>
  </div>

  {/* Main content section */}
  <div className="relative w-full h-full pointer-events-none -mt-[18vh]">
    <div className="relative h-full w-full hidden md:block">
      
      {/* E-CELL Section (Left-Aligned) */}
      <div className="absolute left-[5vw] md:left-[12vw] top-[2vh] md:top-[0vh] -mt-[5vh] md:-mt-[35vh] text-left text-white pointer-events-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">E-CELL</h1>
        <p className="text-lg md:text-xl mb-2">#WeBreedBusiness</p>
        <a href="tel:+918005911799" className="text-lg md:text-xl block mb-2">+91 800591199</a>
        <a href="mailto:ecell@vit.ac.in" className="text-md md:text-lg block mb-4">ecell@vit.ac.in</a>
        <button className="border border-white rounded-full px-4 py-2 text-sm bg-black">
          Contact Us
        </button>
      </div>

      {/* Navigation Links (Right-Aligned) */}
      <div className="absolute right-[5vw] top-[4vh] md:right-[12vw] md:-top-[35vh] text-white pointer-events-auto">
        <nav className="flex flex-col items-start space-y-2">
          <Link href="/" className="hover:text-gray-300">HOME</Link>
          <Link href="/" className="hover:text-gray-300">ABOUT US</Link>
          <Link href="/#timeline" className="hover:text-gray-300">EVENTS</Link>
          {/* <Link href="/activities" className="hover:text-gray-300">ACTIVITIES</Link> */}
        </nav>
      </div>

      {/* Social Media Links (Below Navigation) */}
      <div className="absolute right-[5vw] top-[10vh] md:right-[20vw] md:-top-[35vh] text-white pointer-events-auto">
        <h2 className="font-semibold">COMMUNITY</h2>
        <div className="flex flex-col space-y-2">
          <a href="https://www.instagram.com/ecell_vit" className="hover:text-gray-300 flex items-center space-x-2">
            <FaInstagram size={20} />
            <span>Instagram</span>
          </a>
          <a href="https://twitter.com/ecell_vit" className="hover:text-gray-300 flex items-center space-x-2">
            <FaXTwitter size={20} />
            <span>Twitter</span>
          </a>
          <a href="https://www.linkedin.com/company/ecellvitvellore" className="hover:text-gray-300 flex items-center space-x-2">
            <FaLinkedin size={20} />
            <span>LinkedIn</span>
          </a>
          <a href="https://www.facebook.com/ecellvit" className="hover:text-gray-300 flex items-center space-x-2">
            <FaFacebook size={20} />
            <span>Facebook</span>
          </a>
        </div>
      </div>

    </div>

    {/* Mobile Section */}
    <div className="text-center bg-black text-gray-400 pb-4 font-bold md:hidden w-full">
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://www.linkedin.com/company/ecellvitvellore" className="hover:text-gray-500">
          <FaLinkedin size={20} />
        </a>
        <a href="https://www.instagram.com/ecell_vit" className="hover:text-gray-500">
          <FaInstagram size={20} />
        </a>
        <a href="https://twitter.com/ecell_vit" className="hover:text-gray-500">
          <FaXTwitter size={20} />
        </a>
        <a href="https://www.facebook.com/ecellvit" className="hover:text-gray-500">
          <FaFacebook size={20} />
        </a>
      </div>
      &copy; 2025, <span className="font-bold">Entrepreneurship Cell VIT</span>
    </div>
  </div>
</footer>

  );
}