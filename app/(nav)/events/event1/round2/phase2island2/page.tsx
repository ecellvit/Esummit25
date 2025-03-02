//Not tested yet;
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Round2Form from "@/components/events/round2/component";
import Island1Invoice from "@/components/events/round2/island1Invoice";

type FormEntry = {
    id: number;
    element: string;
    quantity: number;
    transport: "Air" | "Water";
    batch: number;
    warning?: string;
};

export default function Island2Page() {
    const islandId = "island1";
    const [data, setData] = useState<FormEntry[]>([]);
    const [selectedBox, setSelectedBox] = useState<"own" | "local" | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem("islandData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData[islandId] || []);
        } else {
            setData([]); // Prevent undefined state
        }
        console.log("Island1Page rendered with data:", data);
    }, []);

    const handleGoBack = () => {
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    const updateData = (islandId: string, newData: FormEntry[]) => {
        const savedData = localStorage.getItem("islandData");
        const updatedData = savedData ? JSON.parse(savedData) : {};
        updatedData[islandId] = newData;
        localStorage.setItem("islandData", JSON.stringify(updatedData));
        setData(newData);
        console.log("Updated data:", updatedData);
    };

    const handleBoxClick = (box: "own" | "local") => {
        setSelectedBox(box);
    };

    const handleConfirm = () => {
        if (selectedBox === "own") {
            console.log(0);
        } else if (selectedBox === "local") {
            console.log(1);
        }
        setSelectedBox(null);
    };

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden flex items-center justify-center">
            <Island1Invoice data={data} />
            <div className="flex space-x-8 w-1/2">
                <div
                    className="bg-white p-8 rounded-lg shadow-lg text-center w-1/2 h-60 flex flex-col items-center justify-center border border-gray-300 cursor-pointer"
                    onClick={() => handleBoxClick("own")}
                >
                    <h2 className="text-3xl font-extrabold text-black">Own</h2>
                </div>
                <div
                    className="bg-white p-8 rounded-lg shadow-lg text-center w-1/2 h-60 flex flex-col items-center justify-center border border-gray-300 cursor-pointer"
                    onClick={() => handleBoxClick("local")}
                >
                    <h2 className="text-3xl font-extrabold text-black">Local</h2>
                </div>
            </div>
            {selectedBox && (
                <div className="absolute bg-white p-10 rounded-lg shadow-xl flex flex-col items-center w-80 h-40 border border-gray-400">
                    <p className="mb-6 text-lg font-semibold">Are you sure?</p>
                    <div className="flex space-x-6">
                        <button
                            className="px-8 py-3 bg-red-500 text-white rounded-lg text-lg font-bold"
                            onClick={() => setSelectedBox(null)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-8 py-3 bg-green-500 text-white rounded-lg text-lg font-bold"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
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
