"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "@/assets/logo2.svg";
import logow from "@/assets/logowhite.svg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function about() {
    const sectionRef = useRef(null);
    const comingSoonRef = useRef<HTMLDivElement>(null);
    const marqueeItems = [
        "Entrepreneurship: Turning The Impossible Into The Inevitable",
        <Image key="logo" src={logow} alt="whitelogo" className="h-[6vh] w-auto mx-6" />,
        "असम्भवं अपरिहार्यं परिणमयति।",
        <Image key="logo" src={logow} alt="whitelogo" className="h-[6vh] w-auto mx-6" />
    ];

    return (
        <section
            id="ESummit"
            ref={sectionRef}
            className="relative w-full h-[140vh] bg-[#0f0000]"
        >
            <div className="sticky top-0 left-0 w-full h-[50vh] flex flex-col items-center justify-center z-0 bg-gradient-to-b from-[#1E1B1A] to-[#0f0000]">
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

                <h1
                    className="relative uppercase pt-1 text-3xl md:text-4xl lg:text-6xl font-[GreaterTheory] text-center z-0 text-white"
                >
                    ABOUT E-SUMMIT
                </h1>
            </div>

            {/* Coming Soon Section */}
            <div
                ref={comingSoonRef}
                className="absolute top-[50vh] h-[85vh] w-full flex items-center justify-center rounded-t-3xl bg-white z-1"
            >
                <div className="h-[80vh] flex flex-col md:flex-row w-full px-10">
                    {/* Left Side: Logo */}
                    <div className="md:w-1/4 w-full flex justify-center items-center">
                        <Image src={logo} alt="logo" className="md:pl-20 w-auto h-[150px] md:h-[400px]" />
                    </div>

                    {/* Right Side: Text Content */}
                    <div className="md:w-3/4 w-full text-black text-md md:text-xl  leading-relaxed flex items-center md:px-20 mt-5 md:mt-0">
                        <p>
                            E-Summit is a journey into the world of entrepreneurship, featuring five exhilarating events over a span of four days. It is a platform where ideas spark, fire ignites, and ambition meets opportunity. From high energy pitch battles to game changing workshops, every moment is built to challenge, inspire, and open doors. The biggest names, boldest minds, and brightest opportunities are all here, if you’re ready to push boundaries and make things happen, this is where it starts.
                            <br /><br />
                            The energy is electric, the competition is fierce, and the future is written for those who show up. E-Summit’25 isn’t just another event, it’s a movement where real change begins. Whether you're a founder, or a dreamer with a vision, this is your chance to connect, grow, and leave your mark. The momentum is building, will you be part of it?
                        </p>
                    </div>
                </div>
            </div>


            {/* Marquee Section */}
            <div className="absolute top-[130vh] h-[10vh] w-full bg-gradient-to-r from-[#6F0F0F] via-[#C72423] to-[#510D0D] text-white text-lg pt-[1vh] overflow-hidden whitespace-nowrap">
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
        </section>
    );
};