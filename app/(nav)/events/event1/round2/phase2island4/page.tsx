"use client";
import React, { useState, useEffect } from "react";
import Island4Invoice from "@/components/events/round2/island4Invoice";
import resourceData from "@/constant/round1/element.json";
import { useRouter } from "next/navigation";

type FormEntry = {
    id: number;
    element: string;
    quantity: number;
    transport: "Air" | "Water";
    batch: number;
    warning?: string;
};

export default function Island1Page() {
    const islandId = "island4";
    const router = useRouter();
    const [data, setData] = useState<FormEntry[]>([]);
    const [selectedBox, setSelectedBox] = useState<"setup" | "local" | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [portfolio, setPortfolio] = useState<number[]>([0, 0, 0, 0, 0]);
    const [setupCompleted, setSetupCompleted] = useState<boolean>(false);

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

    const handleConfirm = async () => {
        if (selectedBox) {
            const refineryType = selectedBox;
            const islandNumber = 3;
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

    const handleBoxClick = (box: "setup" | "local") => {
        setSelectedBox(box);
        setDropdownVisible(true);
    };

    const handleCancel = () => {
        setDropdownVisible(false);
        setSelectedBox(null); // Reset the selected box to white
    };
    const getPageData = async () => {
        // setLoading(true);
        try {
            const response = await fetch("/api/event1/getPageDetails", {
                method: "GET",
            });

            if (response.status === 200) {
                const { round, page, startedAt } = await response.json();

                // Convert startedAt (ISO format) to timestamp
                const startTime = new Date(startedAt).getTime();
                const currentTime = Date.now();

                if (
                    (
                        round !== 2 ||
                        page !== 2 ||
                        currentTime - startTime > 25 * 60 * 1000
                    )
                ) {
                    if (round >= 2 && page > 2) {
                        // toast.error("This phase is over.");
                    } else {
                        // toast.error("This phase has not started yet.");
                    }
                    router.push(`/events/event1/round2/waiting`);
                    return;
                } else {
                    try {
                        const response = await fetch("/api/event1/userInfo", {
                            method: "GET",
                        });
                        if (response.ok) {
                            const data = await response.json();
                            const team = data?.team;
                            if (team.setup[3] === 0 || team.setup[3] === 1) {
                                setSetupCompleted(true);
                            }
                        } else {
                            console.log("bad response", response.status);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                router.refresh();
                console.log(response);
            }
        } catch (err) {
            console.log("first fetch failed");
        } finally {
            // setLoading(false);
        }
    };

    const getPortfolioData = async () => {
        try {
            const response = await fetch(`/api/event1/round2/getIslandPortfolio?islandNumber=${encodeURIComponent(3)}`, {
                method: "GET"
            });
    
            if (response.status === 200) {
                const data = await response.json();
                const { portfolio } = data;
                setPortfolio(portfolio);
            } else {
                const data = await response.json();
                console.log("bad response", data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPageData();
        getPortfolioData();
    }, []);

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
            <div className="mt-36"> 
                <Island4Invoice data={data}/>
            </div>
            {!setupCompleted &&
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
             }
            {dropdownVisible && selectedBox &&(
                <div className="mt-2 w-3/4 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                    <table className="w-full border-collapse border border-gray-400">
                        <tbody>
                        <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Setup Time</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "local" ? "Rate: 13 tn/min" : "Rate: 10 tn/min"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Processing Cost</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "local" ? "High" : "Low"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Efficiency</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "local" ? "Lower" : "Higher"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Pros</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "local" ? "Quick Processing, No setup needed" : "Cost-effective, More efficient"}</td>
                            </tr>
                            <tr>
                                <th className="border border-gray-400 p-2 bg-gray-200 text-left">Cons</th>
                                <td className="border border-gray-400 p-2">{selectedBox === "local" ? "Expensive per ton, Lower efficiency for non-primary resources" : "Setup delay, Requires upfront investment"}</td>
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
             {setupCompleted &&
            <div className="w-1/3 bg-white px-20 py-10 mt-10 rounded-xl">
                <h2
                    className="text-2xl font-bold text-black text-center uppercase tracking-wider"
                    style={{ fontFamily: "GreaterTheory" }}
                >Resources</h2>
                <table className="w-full border-collapse border-2 border-black"
                    style={{ fontFamily: "poppins" }}>
                    <thead>
                        <tr className="bg-black">
                            <th className="border-2 border-black px-4 py-2 justify-evenly text-white">
                                RESOURCE NAME
                            </th>
                            <th className="border-2 border-black px-4 py-2 justify-evenly text-white">
                                QUANTITY
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {resourceData.map((resource, index) => (
                            <tr key={index} className="bg-white">
                                <td className="border-2 border-black px-4 py-2">{resource.name}</td>
                                <td className="border-2 border-black px-4 py-2">{portfolio[index] ?? 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            }
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