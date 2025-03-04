// "use client";
// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import Image from "next/image";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import s1 from "@/assets/speaker1.svg";
// import s2 from "@/assets/speaker2.svg";
// import s3 from "@/assets/speaker3.svg";
// import s4 from "@/assets/speaker4.svg";
// import s5 from "@/assets/speaker5.svg";
// import s6 from "@/assets/speaker6.svg";
// import s7 from "@/assets/speaker7.svg";
// import s8 from "@/assets/speaker8.svg";
// import s9 from "@/assets/speaker9.svg";
// import s10 from "@/assets/speaker10.svg";

// gsap.registerPlugin(ScrollTrigger);

// const MeetOurSpeakers: React.FC = () => {
//   const sectionRef = useRef(null);
//   const comingSoonRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const section = sectionRef.current;
//     const mediaQuery = window.matchMedia("(min-width: 768px)");
//     if (mediaQuery.matches) {
//       ScrollTrigger.create({
//         trigger: section,
//         start: "top top",
//         end: "bottom bottom",
//         anticipatePin: 1,
//         onLeaveBack: () => {
//           window.scrollTo({
//             top: document.getElementById("timeline")?.offsetTop,
//             behavior: "smooth",
//           });
//         },
//       });
//     }
//   }, []);
//   return (
//     <section id="speakers" ref={sectionRef} className="relative w-full h-[150vh] bg-white">
//       <div className="sticky top-0 left-0 w-full h-[50vh] flex flex-col items-center justify-center z-0 bg-white">
//         <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
//           <div className="flex w-max animate-speakersMarquee">
//             {[...Array(2)].map((_, i) => (
//               <h1
//                 key={i}
//                 className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-[BrigendsExpanded] tracking-widest leading-none text-center mx-10"
//                 style={{
//                   color: "transparent",
//                   WebkitTextStroke: "2px rgba(176, 81, 25, 0.22)",
//                 }}
//               >
//                 MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS
//               </h1>
//             ))}
//           </div>
//         </div>

//         <h1
//           className="relative uppercase text-3xl md:text-6xl lg:text-7xl font-bold text-center z-0 font-[GreaterTheory]"
//           style={{
//             background:
//               "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           MEET OUR SPEAKERS
//         </h1>
//       </div>

//       {/* Coming Soon Section */}
//       <div
//         ref={comingSoonRef}
//         className="absolute top-[50vh] h-[100vh] w-full flex flex-col items-center justify-center rounded-t-3xl grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-gradient-to-b from-[#510D0D] to-[#C72423] z-10 overflow-hidden"
//       >
//         <div >
//           <Image src={s1} alt="1" className=""/>
//           <Image src={s2} alt="1" />
//           <Image src={s3} alt="1" />
//           <Image src={s4} alt="1" />
//           <Image src={s5} alt="1" />
//           <Image src={s6} alt="1" />
//           <Image src={s7} alt="1" />
//           <Image src={s8} alt="1" />
//           <Image src={s9} alt="1" />
//           <Image src={s10} alt="1" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MeetOurSpeakers;

"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s1 from "@/assets/speaker1.svg";
import s2 from "@/assets/speaker2.svg";
import s3 from "@/assets/speaker3.svg";
import s4 from "@/assets/speaker4.svg";
import s5 from "@/assets/speaker5.svg";
import s6 from "@/assets/speaker6.svg";
import s7 from "@/assets/speaker7.svg";
import s8 from "@/assets/speaker8.svg";
import s9 from "@/assets/speaker9.svg";
import s10 from "@/assets/speaker10.svg";

gsap.registerPlugin(ScrollTrigger);

const MeetOurSpeakers: React.FC = () => {
  const sectionRef = useRef(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    if (mediaQuery.matches) {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        anticipatePin: 1,
        onLeaveBack: () => {
          window.scrollTo({
            top: document.getElementById("timeline")?.offsetTop,
            behavior: "smooth",
          });
        },
      });
    }
  }, []);

  return (
    <section id="speakers" ref={sectionRef} className="relative w-full min-h-[150vh] py-20 bg-white">
      <div className="sticky top-0 left-0 w-full h-[50vh] flex flex-col items-center justify-center z-0 bg-white">
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-speakersMarquee">
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-[BrigendsExpanded] tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(176, 81, 25, 0.22)",
                }}
              >
                MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS
              </h1>
            ))}
          </div>
        </div>

        <h1
          className="relative uppercase text-3xl md:text-6xl lg:text-7xl font-bold text-center z-0 font-[GreaterTheory]"
          style={{
            background:
              "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MEET OUR SPEAKERS
        </h1>
      </div>

      {/* 🔹 Responsive Grid Layout */}
      <div
        ref={comingSoonRef}
        className="absolute top-[50vh] h-[100vh] w-full flex items-center justify-center rounded-t-3xl bg-gradient-to-b from-[#510D0D] to-[#C72423] z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-7 md:p-3 lg:p-0 w-[90%] mx-auto">
          {[s1, s2, s3, s4, s5, s6, s7, s8, s9, s10].map((speaker, index) => (
            <div key={index} className="flex justify-center items-center">
              <Image src={speaker} alt={`Speaker ${index + 1}`} className="w-full h-auto object-cover"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurSpeakers;
