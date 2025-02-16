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

export default function Footer() {
  const [value, setValue] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="text-black w-full bg-white shadow-md fixed bottom-0 left-0 z-[-1] h-[20vh] flex flex-col justify-end items-center ">
      <div className="flex items-center justify-evenly w-full">
        {/* Desktop Social Media Links */}
        <div className="flex-col space-y-1 text-lg pt-[5vw] hidden md:flex">
          <a
            href="https://www.linkedin.com/company/ecellvitvellore"
            className="hover:text-gray-500"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/ecell_vit"
            className="hover:text-gray-500"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com/ecell_vit"
            className="hover:text-gray-500"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href="https://www.facebook.com/ecellvit"
            className="hover:text-gray-500"
          >
            <FaFacebook size={20} />
          </a>
        </div>

        {/* Main Title */}
        <h1 className="text-[11vw] font-black tracking-widest flex">
          {["E", "-", "S", "U", "M", "M", "I", "T", "'", "2", "5"].map(
            (chars, index) => (
              <div
                key={index}
                className="inline-block h-[12vw] items-end transition-all duration-400 hover:font-light"
              >
                {chars}
              </div>
            )
          )}
        </h1>
      </div>

      {/* Scrolling Text */}
      <div className="flex items-center bg-black text-gray-400 text-lg py-4 w-full relative overflow-hidden">
        <div className="lg:w-2/3 sm:w-full overflow-hidden whitespace-nowrap">
          <div className="animate-scroll flex">
            {Array(10)
              .fill("#WeBreedBusiness")
              .map((text, index) => (
                <span key={index} className="text-lg font-medium mr-10">
                  {text}
                </span>
              ))}
          </div>
        </div>
        {/* Desktop Copyright */}
        <div className="w-1/3 text-center font-bold hidden md:block">
          &copy; 2025,{" "}
          <span className="font-bold">Entrepreneurship Cell VIT</span>
        </div>
      </div>

      {/* Mobile Copyright & Socials */}
      <div className="text-center bg-black text-gray-400 pb-4 font-bold md:hidden w-full">
        <div className="flex justify-center space-x-4 mt-2">
          <a
            href="https://www.linkedin.com/company/ecellvitvellore"
            className="hover:text-gray-500"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/ecell_vit"
            className="hover:text-gray-500"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com/ecell_vit"
            className="hover:text-gray-500"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href="https://www.facebook.com/ecellvit"
            className="hover:text-gray-500"
          >
            <FaFacebook size={20} />
          </a>
        </div>
        &copy; 2025,{" "}
        <span className="font-bold">Entrepreneurship Cell VIT</span>
        {/* Social Media Icons for Mobile */}
      </div>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          display: flex;
          white-space: nowrap;
          animation: scroll 10s linear infinite;
          width: max-content;
        }
      `}</style>
    </footer>
  );
}
