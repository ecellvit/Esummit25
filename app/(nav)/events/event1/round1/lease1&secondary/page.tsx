"use client";
import React, { useState } from "react";
import Image from "next/image";
import bg from "/assets/scrollBg.svg";

export default function page() {
    return (
        <div className="relative w-full h-full min-h-screen">
            <div className="fixed inset-0 overflow-hidden">
                <Image 
                    src={bg} 
                    alt="bg" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 transform scale-110" 
                    priority
                />
                <div className="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-900/10 to-gray-900/30 z-1"></div>
            </div>
            <>
            {/* Write Page Code Here */}
            </>
        </div>
    );
}