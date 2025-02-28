"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import resourceData from "@/constant/round1/element.json";
import dynamic from "next/dynamic";
import "chart.js/auto";
import SellButton from "@/components/events/Round1/SellButton";
import { initializeSocket, socket } from "@/socket";
import calculateMarketPrice from "@/utils/calculateMarketPrice";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

// Dynamically import Chart.js Line component
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
    ssr: false,
});

interface ElementData {
    id: number;
    name: string;
    basePrice: number;
    teamsBought: number;
    marketPrice: number;
}

const fetchMarketData = async () => {
    const data: ElementData[] = resourceData.map((data, index) => ({
        id: index,
        name: data.name,
        basePrice: data.base,
        teamsBought: 0,
        marketPrice: calculateMarketPrice(data.base, 0),
    }));
    return data;
};

const fetchPortfolioData = async (): Promise<number[] | null> => {
    try {
        const response = await axios.get('/api/event1/round1/getPortfolio');
    
        if (response.status === 200) {
            return response.data.portfolio;
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError) {
            const errorData = axiosError.response?.data as ApiResponse;
            toast.error(
                errorData.message || "Error in leasing the resource"
            );
        } else {
            toast.error("An error occurred while leasing the resource.");
        }
    }
    return null;
};

const sellResources = async () => {
    const response = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
            { elementIndex: 0, amount: 10 },
            { elementIndex: 1, amount: 5 },
        ]),
    });
    const result = await response.json();
    console.log(result);
};

const Dashboard: React.FC = () => {
    const router = useRouter()
    const [marketData, setMarketData] = useState<ElementData[]>([]);
    const [portfolio, setPortfolio] = useState<number[]>([0, 0, 0, 0, 0]);
    const [selectedGraph, setSelectedGraph] = useState<number | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [socketLoading, setSocketLoading] = useState<Boolean>(true);

    // Socket helper functions
    const onMarketPrice = (data: { elementId: number; marketPrice: number }) => {
        setMarketData((prevMarketData) =>
            prevMarketData.map((item, index) =>
                index === data.elementId
                    ? { ...item, marketPrice: data.marketPrice }
                    : item
            )
        );
        console.log(data);
    };

    const onPortfolioUpdate = (data: { portfolio: number[] }) => {
        console.log(data);
        setPortfolio(data.portfolio);
    };

    // Get initial data

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const marketData = await fetchMarketData();
            setMarketData(marketData);

            const portfolioData = await fetchPortfolioData();
            console.log(portfolioData);
            if (portfolioData) {
                setPortfolio(portfolioData);
            }
            setLoading(false);
        };
        getData();
    }, []);

    // Connect to socket server
    
    useEffect(() => {
        // Initial connection status check
        console.log("Socket connection status:", socket.connected);
        if (socket.connected) {
            setSocketLoading(false);
            onConnect();
        }

        async function setupSocket() {
            const result = await initializeSocket();
            
            if (!result.success) {
                setSocketLoading(true);
                setupSocket();
            }

            setSocketLoading(false);
        }
        
        if (!socket.connected) {
            setupSocket();
        }
    
        function onConnect() {
            socket.io.engine.on("upgrade", (transport) => {
                console.log("upgrade ::", transport.name);
            });
        }

        function onDisconnect(reason: string) {
            console.warn("Socket disconnected:", reason);
            if (reason === "ping timeout" || reason === "transport error") {
              socket.connect(); // Try reconnecting manually
            }
        }

        socket.on("connect", onConnect);
        socket.on("marketPrice", onMarketPrice);
        socket.on("portfolioUpdate", onPortfolioUpdate);
        socket.on("disconnect", onDisconnect);

        return () => {
        socket.off("connect", onConnect);
        socket.off("marketPrice", onMarketPrice);
        socket.off("portfolioUpdate", onPortfolioUpdate);
        socket.off("disconnect", onDisconnect);
        };
    }, [socket.connected]);

    const openGraph = (index: number) => {
        setSelectedGraph(index);
    };

    const closeGraph = () => {
        setSelectedGraph(null);
    };

    const handleGoBack = () => {
        console.log("Going back to previous page");
        router.replace('/events/event1/round1/waiting');
    };

    return (
        <div className="absolute w-full h-full min-h-screen bg-[#c4baba]">
            {/* Loader */}
            {(loading || socketLoading) && <Loader/>}

            {/* Main Content */}
            <div
                className={`mt-8 mb-6 container w-[85vw] h-[85vh] px-2 py-20 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-hidden ${
                    selectedGraph !== null ? "blur-md pointer-events-none" : ""
                }`}
            >
                <h1 className="text-4xl font-extrabold mb-6 text-black drop-shadow-md">
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500"
                        style={{ fontFamily: "GreaterTheory" }}
                    >
                        USER DASHBOARD
                    </span>
                </h1>

                {/* Main Content Container */}
                <div className="flex flex-row gap-2 w-full justify-center">
                    {/* Left Section */}
                    <div className="w-2/3 bg-[#BB2121] p-2 rounded-xl overflow-y-auto scrollbar-hide">
                        <h2
                            className="text-2xl font-bold mb-4 text-white text-center uppercase tracking-wider"
                            style={{ fontFamily: "GreaterTheory" }}
                        >
                            MARKET PRICE
                        </h2>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {marketData.map((element, index) => (
                                <div
                                    key={element.id}
                                    className="bg-white rounded-md p-2 cursor-pointer hover:shadow-lg transition-all duration-300"
                                    onClick={() => openGraph(index)}
                                >
                                    <div className="h-[150px] w-full">
                                        <Line
                                            data={{
                                                labels: ["9:30", "10:00", "10:30", "11:00", "11:30"],
                                                datasets: [
                                                    {
                                                        label: `${element.name} Market Price`,
                                                        data: [
                                                            element.marketPrice,
                                                            element.marketPrice * 1.02,
                                                            element.marketPrice * 0.98,
                                                            element.marketPrice * 1.01,
                                                            element.marketPrice * 0.99,
                                                        ],
                                                        borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                                        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
                                                        tension: 0.1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    </div>
                                    <p className="text-center font-semibold mt-2">{element.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-1/3 bg-[#BB2121] px-6 py-2 rounded-xl">
                        <h2
                            className="text-2xl font-bold my-4 text-white text-center uppercase tracking-wider"
                            style={{ fontFamily: "GreaterTheory" }}
                        >Resources</h2>
                        <table className="w-full border-collapse border-2 border-[#BB2121]"
                            style={{ fontFamily: "poppins" }}>
                            <thead>
                                <tr className="bg-black">
                                    <th className="border-2 border-[#BB2121] px-4 py-2 justify-evenly text-white">
                                        RESOURCE NAME
                                    </th>
                                    <th className="border-2 border-[#BB2121] px-4 py-2 justify-evenly text-white">
                                        QUANTITY
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {resourceData.map((resource, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="border-2 border-[#BB2121] px-4 py-2">{resource.name}</td>
                                        <td className="border-2 border-[#BB2121] px-4 py-2">{portfolio[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Sell Button */}
                        <div className="mt-5">
                            {/* <button
                             onClick={sellResources}
                             className="px-20 py-2 bg-white text-red-950 font-bold rounded-lg hover:bg-red-800 hover:text-white">
                                SELL
                            </button> */}
                            <SellButton />
                        </div>
                    </div>
                </div>

                    </div>
                <div className="mt-0.5 flex justify-center">
                    <button 
                        onClick={handleGoBack}
                        className="px-8 py-3 text-white transition-all duration-300 shadow-lg active:shadow active:translate-y-1 flex items-center bg-[#B82121] rounded-lg hover:bg-[#8a1919] hover:shadow-md hover:scale-105  font-extrabold tracking-widest"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                </div>
                {/* <div className="flex flex-row justify-center ">
                    <button className="bg-red-700 px-10 py-2 rounded-xl font-bold text-white hover:text-red-700 hover:bg-black" onClick={()=> console.log(portfolio)}>Continue</button>
                </div> */}


            {/* Popup for expanded graph */}
            {selectedGraph !== null && marketData.length > 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-[0.7] backdrop-blur-sm z-[60] transition-all duration-300">
                    <div className="bg-white p-6 rounded-xl w-[75vw] relative h-[80vh]">
                        {/* Close Button */}
                        <button
                            onClick={closeGraph}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full absolute top-[10px] right-[10px]"
                        >
                            Close
                        </button>

                        {/* Graph */}
                        <Line
                            data={{
                                labels: ["9:30", "10:00", "10:30", "11:00", "11:30"],
                                datasets: [
                                    {
                                        label: `${marketData[selectedGraph].name} Market Price`,
                                        data: [
                                            marketData[selectedGraph].marketPrice,
                                            marketData[selectedGraph].marketPrice * 1.02,
                                            marketData[selectedGraph].marketPrice * 0.98,
                                            marketData[selectedGraph].marketPrice * 1.01,
                                            marketData[selectedGraph].marketPrice * 0.99,
                                        ],
                                        borderColor: `hsl(${selectedGraph * 60}, 70%, 50%)`,
                                        backgroundColor: `hsla(${selectedGraph * 60}, 70%, 50%, 0.2)`,
                                        tension: 0.1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}

export default Dashboard;