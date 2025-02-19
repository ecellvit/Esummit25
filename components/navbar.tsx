// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import logo from "/assets/whiteLogo.png";
// import hamburgerIcon from "/assets/hamburger.jpg";
// import closeIcon from "/assets/close.jpg";
// import SignInBtn from "./signinButton";

// const Navbar: React.FC = () => {
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [visible, setVisible] = useState(true);
//   const lastScrollY = useRef(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY.current) {
//         setVisible(false);
//       } else {
//         setVisible(true);
//       }
//       lastScrollY.current = window.scrollY;
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isMenuOpen]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       <nav
//         style={{
//           fontFamily: "AllRoundGothic, sans-serif",
//         }}
//         className={`fixed top-3 left-[45%] sm:left-[50%] md:left-[50%] 
//           w-[100vw] sm:w-[85vw] md:w-[70vw] lg:w-[60vw] h-[8vh] 
//           rounded-xl border border-red-400 shadow-xl z-10 p-4 
//           flex items-center justify-between 
//           bg-cover bg-black opacity-80 bg-center backdrop-blur-lg 
//           transition-transform duration-300 transform -translate-x-1/2`}
  
//         // absolute left-[45%] sm:left-[48%] md:left-[50%] top-2 
//         // w-[95vw] sm:w-[75vw] md:w-[60vw] h-[8vh] 
//         // rounded-xl border border-red-400 shadow-xl z-[1000] p-4 
//         // flex items-center justify-between 
//         // bg-cover bg-black opacity-90 bg-center backdrop-blur-lg 
//         // transition-transform duration-300 transform -translate-x-1/2
//       >
//        {/* Logo (Hidden on Small Screens) */}
// <Link href="/" className="hidden md:block">
//   <Image
//     src={logo}
//     alt="WhiteLogo"
//     width={30}
//     height={30}
//     className="cursor-pointer"
//   />
// </Link>


//         {/* Hamburger Icon */}
//         <div className="md:hidden">
//           <button
//             onClick={toggleMenu}
//             className="focus:outline-none bg-transparent"
//           >
//             {!isMenuOpen ? (
//               <Image src={hamburgerIcon} alt="Menu" width={40} height={40} />
//             ) : (
//               <Image src={closeIcon} alt="Close" width={40} height={40} />
//             )}
//           </button>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex space-x-10 justify-center items-center font-allround">
//         <Link href="/" className="text-white hover:text-red-400 ">
//             HOME
//           </Link>
//           <Link href="/#timeline" className="text-white hover:text-red-400 ">
//             ABOUT
//           </Link>
//           <Link
//             href="/MySchedule"
//             className="text-white font-allround hover:text-red-400"
//           >
//             MY SCHEDULE
//           </Link>
//           <Link
//             href="/patrons"
//             className="text-white font-allround hover:text-red-400"
//           >
//             OUR PATRONS
//           </Link>
//           <Link
//             href="/#footer"
//             className="text-white font-allround hover:text-red-400"
//           >
//             CONTACT US
//           </Link>
//           <SignInBtn />
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//   <div className="fixed inset-0 bg-transparent bg-opacity-85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-12 text-white text-xl">
//     {/* Close Button */}
//     <button onClick={toggleMenu} className="text-3xl mb-8">
//       &times;
//     </button>
//     {/* Links and Sign In Button */}
//     <div className="flex flex-col items-center justify-center space-y-6">
//     <Link href="/" onClick={toggleMenu}>
//         HOME
//       </Link>
//       <Link href="/#timeline" onClick={toggleMenu}>
//         ABOUT
//       </Link>
//       <Link href="/#MySchedule" onClick={toggleMenu}>
//         MY SCHEDULE
//       </Link>
//       <Link href="/#speakers" onClick={toggleMenu}>
//         OUR PATRONS
//       </Link>
//       <Link
//         href="/#footer"
//         className="text-white font-allround hover:text-red-400"
//       >
//         CONTACT US
//       </Link>
      
//     </div>
//   </div>
// )}
//     </>
//   );
// };

// export default Navbar;

// const Navbar: React.FC = () => {
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [visible, setVisible] = useState(true);
//   const lastScrollY = useRef(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > lastScrollY.current) {
//         setVisible(false);
//       } else {
//         setVisible(true);
//       }
//       lastScrollY.current = window.scrollY;
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isMenuOpen]);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       <nav
//         style={{
//           fontFamily: "AllRoundGothic, sans-serif",
//         }}
//         className={`fixed top-3 left-[50%] w-[100vw] sm:w-[85vw] md:w-[70vw] lg:w-[60vw] h-[8vh]   
//           rounded-xl border border-red-400 shadow-xl z-10 p-4 
//           flex items-center justify-between 
//           transition-transform duration-300 transform -translate-x-1/2 
//           bg-transparent md:bg-black  lg:bg-black opacity-80
//          `}

//       >
//         {/* Logo (Hidden on Small Screens) */}
//         <Link href="/" className="hidden md:block">
//           <Image
//             src={logo}
//             alt="WhiteLogo"
//             width={30}
//             height={30}
//             className="cursor-pointer"
//           />
//         </Link>

//         {/* Mobile: Hamburger + Sign-In Button */}
//         <div className="md:hidden flex justify-center space-x-10 relative">
//           {/* Sign-In Button styled as white text with no box */}
//           <button
//             onClick={toggleMenu}
//             className="focus:outline-none bg-transparent "
//           >
//             {!isMenuOpen ? (
//               <Image src={hamburgerIcon} alt="Menu" width={40} height={40} />
//             ) : (
//               <Image src={closeIcon} alt="Close" width={40} height={40} />
//             )}
//           </button>
//           <div className="fixed left-[60%] pb-[3vh]">
//           <SignInBtn className="text-white border-none bg-transparent hidden " /></div>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex space-x-10 justify-center items-center font-allround text-sm md:text-sm ">
//           <Link href="/" className="text-white hover:text-red-400">
//             HOME
//           </Link>
//           <Link href="/#Esummit" className="text-white hover:text-red-400">
//             ABOUT
//           </Link>
//           <Link href="/MySchedule" className="text-white hover:text-red-400">
//             MY SCHEDULE
//           </Link>
//           <Link href="/patrons" className="text-white hover:text-red-400">
//             OUR PATRONS
//           </Link>
//           <Link href="/#footer" className="text-white hover:text-red-400">
//             CONTACT US
//           </Link>
//         </div>
//         <div className="hidden md:block">
//             <SignInBtn /></div>
//       </nav>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="fixed inset-0 bg-black opacity-90 backdrop-blur-lg z-[9999] flex flex-col items-center justify-center space-y-12 text-white text-lg">
//           {/* Close Button */}
//           <button onClick={toggleMenu} className="text-3xl mb-8">
//             &times;
//           </button>
//           {/* Links */}
//           <div className="flex flex-col items-center justify-center space-y-6">
//             <Link href="/" onClick={toggleMenu}>
//               HOME
//             </Link>
//             <Link href="/#Esummit" onClick={toggleMenu}>
//               ABOUT
//             </Link>
//             <Link href="/MySchedule" onClick={toggleMenu}>
//               MY SCHEDULE
//             </Link>
//             <Link href="/patrons" onClick={toggleMenu}>
//               OUR PATRONS
//             </Link>
//             <Link href="/#footer" onClick={toggleMenu}>
//               CONTACT US
//             </Link>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


"use client";
import React, { useState, useEffect, useRef, } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, } from "next/navigation";
import logo from "/assets/whiteLogo.png";
import logored from "@/assets/logo2.svg";
import hamburgerIcon from "/assets/hamburger.svg";
import closeIcon from "/assets/close.jpg";
import SignInBtn from "./signinButton";

interface NavBarProps {
  bgColor?: string;
}

const NavBar: React.FC<NavBarProps> = ({ bgColor = "black" }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(true);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const pathname = usePathname();
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(`/#${id}`);
  };
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [pathname]);
  return (
    <>
      <nav
        style={{ fontFamily: "AllRoundGothic, sans-serif", backgroundColor: bgColor }}
        className={`
          fixed top-0 left-[50%] 
          w-[100vw] sm:w-[85vw] md:w-[80vw] lg:w-[65vw] h-[8vh]
          rounded-b-2xl border border-red-800 shadow-xl z-10 p-3 
          flex items-center justify-between 
          transition-transform duration-300 transform -translate-x-1/2 
          bg-white md:bg-color opacity-80
          ${visible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Logo (Hidden on Small Screens) */}
        <Link href="/" className="hidden md:block">
          <Image src={logo} alt="WhiteLogo" width={30} height={30} className="cursor-pointer" />
        </Link>
        {/* <Link href="/" className="md:hidden">
          <Image src={logored} alt="redLogo" width={30} height={30} className="cursor-pointer" />
        </Link> */}

        {/* Mobile: Hamburger + Sign-In Button */}
        <div className="md:hidden flex justify-stretch items-center relative w-full">
          <div>
          <button onClick={toggleMenu} className="focus:outline-none bg-transparent">
            {!isMenuOpen ? (
              <Image src={hamburgerIcon} alt="Menu" width={40} height={40} />
            ) : (
              <Image src={closeIcon} alt="Close" width={40} height={40} />
            )}
          </button>
          </div>
          <div className="pr-10">
          <Link href="/" className="block md:hidden">
            <Image src={logored} alt="redLogo" width={30} height={30} className="cursor-pointer" />
          </Link>
          </div>
          <div className="absolute right-0 top-0">
            <SignInBtn  />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-nowrap whitespace-nowrap space-x-10 justify-center items-center font-allround text-sm md:text-sm">
          <Link href="/" className="text-white hover:text-red-400">
            HOME
          </Link>
          <Link href="/#ESummit" scroll={false} onClick={(e) => handleScroll(e, "ESummit")} className="text-white hover:text-red-400">
            ABOUT
          </Link>
          <Link href="/MySchedule" className="text-white hover:text-red-400">
            MY SCHEDULE
          </Link>
          <Link href="/patrons" className="text-white hover:text-red-400">
            OUR PATRONS
          </Link>
          {/* <Link href="/#foot" scroll={false} onClick={(e) => handleScroll(e, "foot")} className="text-white hover:text-red-400">
            CONTACT US
          </Link> */}
        </div>

        {/* Desktop Sign-In Button */}
        <div className="hidden md:block">
          <SignInBtn />
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-90 backdrop-brightness-75 -lg z-[9999] flex flex-col items-center justify-center space-y-12 text-white text-lg">
          <button onClick={toggleMenu} className="text-3xl mb-8">
            &times;
          </button>
          <div className="flex flex-col items-center justify-center space-y-6 font-[FontSpring]">
            <Link href="/" onClick={toggleMenu}>
              HOME
            </Link>
            <Link href="/#ESummit" onClick={toggleMenu}>
              ABOUT
            </Link>
            <Link href="/MySchedule" onClick={toggleMenu}>
              MY SCHEDULE
            </Link>
            <Link href="/patrons" onClick={toggleMenu}>
              OUR PATRONS
            </Link>
            {/* ✅ Fix for "CONTACT US" - Smooth scrolling */}
            <Link href="/#foot" onClick={toggleMenu}>
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

xport default NavBar;