"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Round2Form from "@/components/events/round2/component";
import Island1Invoice from "@/components/events/round2/island3Invoice1";

type FormEntry = {
    id: number;
    element: string;
    quantity: number;
    transport: "Air" | "Water";
    batch: number;
    warning?: string;
};

export default function Island1Page() {
    const islandId = "island1";
    const [data, setData] = useState<FormEntry[]>([]);
    const [selectedBox, setSelectedBox] = useState<"own" | "local" | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("islandData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData[islandId] || []);
        } else {
            setData([]);
        }
        console.log("Island1Page rendered with data:", data);
    }, []);

    const handleGoBack = () => {
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    const handleBoxClick = (box: "own" | "local") => {
        setSelectedBox(box);
        setDropdownVisible((prev) => !prev);
    };

    const handleCancel = () => {
        setDropdownVisible(false);
    };

    const handleConfirm = async () => {
        if (selectedBox) {
            const refineryType = selectedBox;
            const islandNumber = 0;
            try {
                const response = await fetch(`/api/event1/round2/setRefineryData?islandNumber=${islandNumber}&refineryData=${refineryType}`, {
                    method: "GET", // GET requests should not have a body
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
    
                if (response.ok) {
                    console.log(`Request sent successfully for ${refineryType}`);
                    await fetch(`/api/event1/round2/setRefineryClick`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ islandNumber }),
                    });
                } else {
                    console.error("Failed to send request");
                }
            } catch (error) {
                console.error("Error while sending request:", error);
            }
        }
        setDropdownVisible(false);
    };
    

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
            <div className="mt-36"> 
                <Island1Invoice data={data} />
            </div>
            <div className="bottom-4 left-1/2 transform flex justify-center mt-8">
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
 
