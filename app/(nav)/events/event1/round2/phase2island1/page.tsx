"use client";
import React, { useState, useEffect } from "react";
import Island1Invoice from "@/components/events/round2/island1Invoice";

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
    const [selectedBox, setSelectedBox] = useState<"setup" | "local" | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem("islandData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData[islandId] || []);
        } else {
            setData([]);
        }
    }, []);

    const handleGoBack = () => {
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    const handleConfirm = () => {
        if (selectedBox === "setup") {
            console.log("setup");
        } else if (selectedBox === "local") {
            console.log("locally");
        }
        setDropdownVisible(false);
    };

    const handleBoxClick = (box: "setup" | "local") => {
        setSelectedBox(box);
        setDropdownVisible(true);
    };

    const handleCancel = () => {
        setDropdownVisible(false);
        setSelectedBox(null); // Reset the selected box to white
    };

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
            <div className="mt-36"> 
                <Island1Invoice data={data} />
            </div>
            <div className="mt-10 flex space-x-8 w-1/2 justify-center">
                <div
                    className={`p-8 rounded-lg shadow-lg text-center w-1/2 h-16 flex items-center justify-center border border-gray-300 cursor-pointer transition-all ${
                        selectedBox === "setup" ? "bg-gradient-to-br from-[#B82121] to-[#000000] text-white" : "bg-white text-black"
                    }`}
                    onClick={() => handleBoxClick("setup")}
                >
                    <h2 className="text-3xl font-extrabold">Setup</h2>
                </div>
                <div
                    className={`p-8 rounded-lg shadow-lg text-center w-1/2 h-16 flex items-center justify-center border border-gray-300 cursor-pointer transition-all ${
                        selectedBox === "local" ? "bg-gradient-to-br from-[#B82121] to-[#000000] text-white" : "bg-white text-black"
                    }`}
                    onClick={() => handleBoxClick("local")}
                >
                    <h2 className="text-3xl font-extrabold">Local</h2>
                </div>
            </div>
            {dropdownVisible && selectedBox && (
                <div className="mt-2 w-3/4 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                    <table className="w-full border-collapse border border-gray-400">
                        <tbody>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Setup Time</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "setup" ? "Rate: 10 tn/min" : "Rate: 13 tn/min"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Processing Cost</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "setup" ? "Low" : "High"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Efficiency</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "setup" ? "Higher" : "Lower"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Pros</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "setup" ? "Cost-effective, More efficient" : "Quick Processing, No setup needed"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Cons</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "setup" ? "Setup delay, Requires upfront investment" : "Expensive per ton, Lower efficiency for non-primary resources"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-center space-x-4 mt-4">
                        <button 
                            onClick={handleCancel}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirm}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
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
