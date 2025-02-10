"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "/assets/whiteLogo.png"
import hamburgerIcon from "/assets/hamburger.jpg"; 
import closeIcon from "/assets/close.jpg"; 
import background from "/assets/bg.png"

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const storyBehindRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentUrl = window.location.href;

    if (currentUrl.endsWith("/#timeline")) {
      timelineRef.current?.click();
    } else if (currentUrl.endsWith("/#storyBehind")) {
      storyBehindRef.current?.click();
    } else if (currentUrl.endsWith("/#footer")) {
      footerRef.current?.click();
    } else {
      heroSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* <nav className="fixed top-0 left-0 w-full shadow-md z-50 p-4 flex items-center justify-between"> */}
      <nav 
  className="fixed top-0 left-0 w-full h-[10vh] shadow-md  z-50 p-4 flex items-center justify-between bg-cover bg-transparent bg-center" 
  style={{ backgroundImage: `url(${background.src})` }}>


      <Image src={logo} alt="WhiteLogo" width={30} height={30} className="cursor-pointer" />

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {!isMenuOpen ? (
              <Image src={hamburgerIcon} alt="Menu" width={40} height={40} />
            ) : (
              <Image src={closeIcon} alt="Close" width={40} height={40} />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10 width-50">
          <Link href="/" className="text-white font-sans hover:text-black-400">Home</Link>
          <Link href="/#timeline" className="text-white font-sans hover:text-black-400">About</Link>
          <Link href="/#storyBehind" className="text-white font-sans hover:text-black-400">Events</Link>
          <Link href="/#footer" className="text-white font-sans hover:text-black-400">Speakers</Link>
        </div>
      </nav>

      {/* Push content down to avoid overlap */}
      <div className="pt-[10vh]"></div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-10 text-white text-2xl">
          <button onClick={toggleMenu} className="text-3xl">&times;</button>
          <Link href="/" onClick={toggleMenu}>Home</Link>
          <Link href="/#timeline" onClick={toggleMenu}>About</Link>
          <Link href="/#storyBehind" onClick={toggleMenu}>Events</Link>
          <Link href="/#footer" onClick={toggleMenu}>Speakers</Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
