"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "/assets/whiteLogo.png";
import hamburgerIcon from "/assets/hamburger.jpg";
import closeIcon from "/assets/close.jpg";
import SignInBtn from "./signinButton";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true); 
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
      style={{
        fontFamily: 'AllRoundGothic, sans-serif'
      }}
      className={`fixed left-[45%] sm:left-[48%] md:left-[50%] top-2 
        w-[95vw] sm:w-[75vw] md:w-[60vw] h-[8vh] 
        rounded-xl border border-red-400 shadow-xl z-50 p-4 
        flex items-center justify-between 
        bg-cover bg-black opacity-90 bg-center backdrop-blur-lg 
        transition-transform duration-300 transform -translate-x-1/2
        `}
      
       
      >
        <Link href="/">
          <Image src={logo} alt="WhiteLogo" width={30} height={30} className="cursor-pointer" />
        </Link>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none bg-transparent">
            {!isMenuOpen ? (
              <Image src={hamburgerIcon} alt="Menu" width={40} height={40} />
            ) : (
              <Image src={closeIcon} alt="Close" width={40} height={40} />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-12 font-allround">
    
          <Link href="/#timeline" className="text-white hover:text-red-400 ">ABOUT</Link>
          <Link href="/MySchedule" className="text-white font-allround hover:text-red-400">MY SCHEDULE</Link>
          <Link href="#speakers" className="text-white font-allround hover:text-red-400">OUR PATRONS</Link>
          <Link href="/#footer" className="text-white font-allround hover:text-red-400">CONTACT US</Link>
          <SignInBtn/>
        </div>
      </nav>

      {/* Push content down to avoid overlap */}
      <div className="pt-[10vh]"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-12 text-white text-xl">
          <button onClick={toggleMenu} className="text-3xl">&times;</button>
          <Link href="/#timeline" onClick={toggleMenu}>ABOUT</Link>
          <Link href="/#MySchedule" onClick={toggleMenu}>MY SCHEDULE</Link>
          <Link href="/#speakers" onClick={toggleMenu}>OUR PATRONS</Link>
          <Link href="/#footer" className="text-white font-allround hover:text-red-400">CONTACT US</Link>
          <SignInBtn/>
        </div>
      )}
    </>
  );
};

export default Navbar;
