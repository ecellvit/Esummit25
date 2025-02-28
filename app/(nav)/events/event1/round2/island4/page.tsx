"use client";
import React from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Round2Form from "@/components/events/round2/component";

export default function Testing() {
    
    const handleGoBack = () => {
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    return (
        <div
            className="relative w-full h-full min-h-screen overflow-hidden"
            style={{
                background:
                    "radial-gradient(63.7% 63.7% at 50% 50%, #35C0FB 0%, #126E9D 100%)",
            }}
        >
            <Image
                src={island4}
                alt="island4"
                className="fixed left-12 top-[10vh] w-auto h-[80vh] object-cover z-10"
                priority
                id="island"
            />
            <div className="relative w-full h-full overflow-auto">
                <Round2Form islandId={3}/>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
                <button 
                    onClick={handleGoBack}
                    className="px-8 py-3 text-white transition-all duration-300 shadow-lg active:shadow active:translate-y-1 flex items-center bg-black rounded-lg hover:shadow-md hover:scale-105 font-extrabold tracking-widest"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                </button>
            </div>
        </div>
    );
}