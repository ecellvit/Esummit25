"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "@/assets/logo2.svg";
import logow from "@/assets/logowhite.svg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const aboutUs: React.FC = () => {
    const sectionRef = useRef(null);

    const marqueeItems = [
        "Entrepreneurship: Turning The Impossible Into The Inevitable",
        <Image key="logo" src={logow} alt="whitelogo" className="h-[6vh] w-auto mx-6" />,
        "असम्भवं अपरिहार्यं परिणमयति।",
        <Image key="logo" src={logow} alt="whitelogo" className="h-[6vh] w-auto mx-6" />
    ];

    return (
        <div>
            <section
                id="ESummit"
                ref={sectionRef}
                className="relative w-full h-[100vh] bg-[#0f0000]"
            >
                <div className="sticky top-0 left-0 w-full h-[25vh] flex flex-col items-center justify-center z-0 bg-gradient-to-b from-[#1E1B1A] to-[#0f0000]">
                    {/* Scrolling Marquee */}
                    <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
                        <div className="flex w-max animate-speakersMarquee">
                            {[...Array(2)].map((_, i) => (
                                <h1
                                    key={i}
                                    className="uppercase text-[8rem] md:text-[10rem] lg:text-[12rem] font-[GreaterTheory] tracking-wide leading-none text-center pb-6 mx-10"
                                    style={{
                                        color: "transparent",
                                        WebkitTextStroke: "2px rgba(255, 255, 255, 0.28)",
                                    }}
                                >
                                    E-SUMMIT &nbsp; E-SUMMIT &nbsp; E-SUMMIT
                                </h1>
                            ))}
                        </div>
                    </div>

                    {/* Main Title */}
                    <h1 className="relative uppercase text-4xl md:text-4xl lg:text-6xl font-[GreaterTheory] text-center z-0 text-white">
                        ABOUT E-SUMMIT
                    </h1>
                </div>

                {/* Coming Soon Section */}
                <div className="flex bg-white w-full rounded-tl-3xl rounded-tr-3xl px-10 pt-20 h-[65vh]">
                    {/* Left Side: Logo */}
                    <div className="w-1/4 flex justify-center items-start pr-5">
                        <Image src={logo} alt="logo" className="w-100 h-80 justify-items-center ml-44" />
                    </div>

                    {/* Right Side: Text Content */}
                    <div className="w-3/4 pl-60 text-black text-lg leading-relaxed">
                        <p>
                        E-Summit is a launchpad to the evolving world of entrepreneurship. Though it appears as a single event, it is a powerhouse of inspiring activities and thought provoking sessions that cultivate networking and expand student’s business perspectives. Featuring a unique blend of thrilling competitions, engaging workshops, dynamic expos, and remarkable speakers, it is designed to ignite innovation in young minds. 

E-Summit features five events over four days which provides an immersive business simulation experience, showcases the journeys of successful entrepreneurs, and brings together industry experts to share their insights. It also offers valuable sessions focused on refining startup strategies. Concluding with a platform to present ideas to seasoned professionals, E-Summit is a comprehensive package of entrepreneurial learning and growth.
                        </p>
                    </div>
                </div>

                {/* Marquee Section */}
                <div className="bg-gradient-to-r from-[#6F0F0F] via-[#C72423] to-[#510D0D] text-white text-lg h-[7vh] overflow-hidden whitespace-nowrap relative">
                    <div className="absolute flex min-w-max animate-marquee">
                        {[...marqueeItems, ...marqueeItems].map((item, index) => (
                            <div key={index} className="flex items-center px-4 py-2">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marquee Animation */}
                <style jsx>{`
                    @keyframes marquee {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 10s linear infinite;
                    }
                `}</style>

                <div className="bg-white h-[3vh]"></div>
            </section>
        </div>
    );
};

export default aboutUs;


// "use client";
// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const aboutUs: React.FC = () => {
//   const sectionRef = useRef(null);
//   const comingSoonRef = useRef<HTMLDivElement>(null);
//   return (

//       <div className="sticky top-0 left-0 w-full h-[25vh] flex flex-col items-center justify-center z-0  bg-gradient-to-b from-[#1E1B1A] to-[#230505]">
//         {/* Scrolling Marquee */}
//         <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap ">
//           <div className="flex w-max animate-speakersMarquee">
//             {[...Array(2)].map((_, i) => (
//               <h1
//                 key={i}
//                 className="uppercase text-[8rem] md:text-[10rem] lg:text-[12rem] font-[GreaterTheory]  tracking-wide leading-none text-center pb-6 mx-10"
//                 style={{
//                   color: "transparent",
//                   WebkitTextStroke: "2px rgba(255, 255, 255, 0.28)",
//                 }}
//               >
//                 E-SUMMIT &nbsp; E-SUMMIT &nbsp; E-SUMMIT
//               </h1>
//             ))}
//           </div>
//         </div>

//         {/* Main Title */}
//         <h1
//           className="relative uppercase text-4xl md:text-4xl lg:text-6xl font-[GreaterTheory] text-center z-0 text-white"
//         >
//           ABOUT E-SUMMIT
//         </h1>
//       </div>

//       {/* Coming Soon Section */}
//           <div className="absolute top-[40vh] h-auto w-full flex items-center justify-center bg-white z-1 rounded-tl-2xl rounded-tr-2xl">

//           </div>


// };

// export default aboutUs;

// "use client";
// import { gsap } from "gsap";
// import React from "react";
// import logo from "@/assets/redLogo.png";
// import Image from "next/image";

// export default function aboutUs() {
//     return (
//         <div className=" bg-gradient-to-b from-[#1E1B1A] to-[#0f0000] overflow-hidden">
//             <div className="sticky top-0 left-0 w-full h-[25vh] flex flex-col items-center justify-center  bg-gradient-to-b from-[#1E1B1A] to-[#0f0000]">
//                 <div className="absolute inset-0 flex w-max items-center overflow-hidden whitespace-nowrap">
//                     <h1 className="uppercase text-[7rem] md:text-[9rem] lg:text-[11rem] font-[GreaterTheory]  tracking-wide leading-none text-center pb-6 mx-10"
//                         style={{
//                             color: "transparent",
//                             WebkitTextStroke: "2px rgba(255, 255, 255, 0.28)",
//                         }}
//                     >E-SUMMIT'25</h1>
//                 </div>
//                 <div className="relative uppercase text-4xl md:text-4xl lg:text-6xl font-[GreaterTheory] text-center justify-center z-10 text-white">
//                     ABOUT E-SUMMIT
//                 </div>
//             </div>

//             <div className=" flex bg-white w-full h-3/4 rounded-tl-3xl rounded-tr-3xl flex-wrap ">
//                 <div className="w-1/4 h-3/4 justify-center p-7 mr-16 mt-10">
//                 <Image src={logo} alt="logo" className="h-10rem w-10rem" />
//                 </div>
//                 <div className="w-3/4 h-3/4 justify-center  p-7">content</div>
//                 <div className="w-full h-1/4 justify-center p-7">marquee</div>
//             </div>
//         </div >
//     )
// }

// "use client";
// import { gsap } from "gsap";
// import React from "react";
// import logo from "@/assets/logo2.svg";
// import Image from "next/image";

// export default function AboutUs() {
//     return (
//         <div className="bg-gradient-to-b from-[#1E1B1A] to-[#0f0000] overflow-hidden">
//             {/* Header Section */}
//             <div className="sticky top-0 left-0 w-full h-[25vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#1E1B1A] to-[#0f0000]">
//                 <div className="absolute inset-0 flex w-max items-center overflow-hidden whitespace-nowrap">
//                     <h1 className="uppercase text-[7rem] md:text-[9rem] lg:text-[11rem] font-[GreaterTheory] tracking-wide leading-none text-center pb-6 mx-10"
//                         style={{
//                             color: "transparent",
//                             WebkitTextStroke: "2px rgba(255, 255, 255, 0.28)",
//                         }}
//                     >E-SUMMIT'25</h1>
//                 </div>
//                 <div className="relative uppercase text-4xl md:text-4xl lg:text-6xl font-[GreaterTheory] text-center justify-center z-10 text-white">
//                     ABOUT E-SUMMIT
//                 </div>
//             </div>

//             {/* Content Section */}
//             <div className="flex bg-white w-full rounded-tl-3xl rounded-tr-3xl px-10 py-16">
//                 {/* Left Side: Logo */}
//                 <div className="w-1/4 flex justify-center items-start pr-5">
//                     <Image src={logo} alt="logo" className="w-[20vh] h-[10vh] justify-center items-center" />
//                 </div>

//                 {/* Right Side: Text Content */}
//                 <div className="w-3/4 text-black text-lg leading-relaxed">
//                     <p>
//                         E-Summit is the conclave that opens the doors to the world of entrepreneurship. Masquerading as a single event,
//                         it is a fusion of visionary activities and insightful sessions that open the realm of networking and broaden the horizon
//                         of business in students' minds. With its exclusive class of exhilarating events, interesting workshops, exciting expos
//                         and spectacular speakers, E-Summit aims at instilling innovation in young minds.
//                         <br/><br/>
//                         E-Summit is the conclave that opens the doors to the world of entrepreneurship. Masquerading as a single event, it is a fusion of visionary
//                         activities and insightful sessions that open the realm of networking and broaden the horizon of business in students' minds. With its exclusive class of
//                         exhilarating events, interesting workshops, exciting expos and spectacular speakers, E-Summit aims at instilling innovation in young minds.
//                         <br/>
//                     </p>
//                 </div>
//             </div>

//             {/* Marquee Section */}
//             <div className="bg-[#1E1B1A] text-white text-lg py-3 text-center">
//                 Entrepreneurship: Turning The Impossible Into The Inevitable
//             </div>
//         </div>
//     );
// }
