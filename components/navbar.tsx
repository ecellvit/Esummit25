"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "/assets/whiteLogo.png";
import hamburgerIcon from "/assets/hamburger.jpg";
import closeIcon from "/assets/close.jpg";
import background from "/assets/bg.png";
import SignInBtn from "./signinButton";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true); // Track navbar visibility
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setVisible(false); // Hide on scroll down
      } else {
        setVisible(true); // Show on scroll up
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
        className={`fixed top-0 left-0 w-full h-[10vh] shadow-md z-50 p-4 flex items-center justify-between bg-cover bg-transparent bg-center transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ backgroundImage: `url(${background.src})` }}
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
        <div className="hidden md:flex space-x-10">
          <Link href="/" className="text-white font-sans hover:text-black-400">Home</Link>
          <Link href="/#timeline" className="text-white font-sans hover:text-black-400">About</Link>
          <Link href="/#storyBehind" className="text-white font-sans hover:text-black-400">Events</Link>
          <Link href="#meetOurSpeakers" className="text-white font-sans hover:text-black-400">Speakers</Link>
          <Link href="/MySchedule" className="text-white font-sans hover:text-black-400">My Shcedule</Link>
          <SignInBtn/>
        </div>
      </nav>

      {/* Push content down to avoid overlap */}
      <div className="pt-[10vh]"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-12 text-white text-xl">
          <button onClick={toggleMenu} className="text-3xl">&times;</button>
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/#timeline" onClick={toggleMenu}>About</Link>
          <Link href="/#storyBehind" onClick={toggleMenu}>Events</Link>
          <Link href="/#footer" onClick={toggleMenu}>Speakers</Link>
          <Link href="/MySchedule" className="text-white font-sans hover:text-black-400">My Shcedule</Link>
          <SignInBtn/>
        </div>
      )}
    </>
  );
};

export default Navbar;
