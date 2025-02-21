"use client";
import React, { useState, useEffect, useRef, } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, } from "next/navigation";
import logo from "/assets/whiteLogo.svg";
import ecellwhite from "@/assets/Ecellwhitenavbar.svg";
import hamburgerIcon from "/assets/hamburger.svg";
import closeIcon from "/assets/close.jpg";

const NavBar: React.FC<> = () => {

  return (
    <>
      <nav
        style={{ fontFamily: "AllRoundGothic, sans-serif" }}
        className="fixed top-0 md:top-4 left-[50%] 
          w-[100vw] sm:w-[85vw] md:w-[80vw] lg:w-[65vw] h-[8vh]
          rounded-b-lg md:rounded-2xl border border-red-800 shadow-xl z-50 p-3 
          flex items-center justify-between  
          transition-transform duration-300 transform -translate-x-1/2 
          bg-black md:bg-color opacity-80 translate-y-0"
      >
        
      </nav>

    </>
  );
};

export default NavBar;