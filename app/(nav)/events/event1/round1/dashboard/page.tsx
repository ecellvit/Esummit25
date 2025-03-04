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
    id?: number;
    name?: string;
    basePrice?: number;
    marketPrice?: number;
    marketHistory?: number[];
}

const fetchMarketData = async () => {
    const data: ElementData[] = resourceData.map((data, index) => {
        const marketPrice = calculateMarketPrice(data.base, 0);
        return {
            id: index,
            name: data.name,
            basePrice: data.base,
            marketPrice: marketPrice,
            marketHistory: [marketPrice], // Initialize with current market price
        };
    });

    try {
        const response = await axios.get('/api/event1/round1/getMarketInfo');
        if (response.status === 200) {
            const { marketData } = response.data;
            if (marketData && Array.isArray(marketData)) {
                marketData.forEach(item => {
                    const elementIndex = data.findIndex(element => element.id === item.elementId);
                    if (elementIndex !== -1) {
                        // Replace or update marketHistory with the one from API
                        data[elementIndex].marketHistory = [...item.marketHistory];
                        // Update current market price
                        data[elementIndex].marketPrice = item.marketPrice;
                    }
                });
            }
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        if (axiosError) {
            const errorData = axiosError.response?.data as ApiResponse;
            toast.error(
                errorData.message || "Error in fetching the data"
            );
        } else {
            toast.error("An error occurred while fetching the marketData.");
        }
    }
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
    const [showSell, setShowSell] = useState<Boolean>(false);

    const fetchRoundData = async () => {
        const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

        if (response.status === 200) {
            const { sellingStarted } = await response.json();

            if (sellingStarted) {
                setShowSell(true);
            }
        } else {
            router.refresh();
        }
    }

    // Socket helper functions
    const onMarketPrice = (data: { elementId: number; marketPrice: number }) => {
        setMarketData((prevMarketData) =>
            prevMarketData.map((item, index) => {
                if (index === data.elementId) {
                    // Create a new history array with the updated price
                    const newHistory = [...(item.marketHistory || []), data.marketPrice];
                    return {
                        ...item,
                        marketPrice: data.marketPrice,
                        marketHistory: newHistory
                    };
                } else {
                    // For elements that didn't change, duplicate the last price in history
                    const currentHistory = item.marketHistory || [];
                    if (currentHistory.length > 0) {
                        const lastPrice = currentHistory[currentHistory.length - 1];
                        return {
                            ...item,
                            marketHistory: [...currentHistory, lastPrice]
                        };
                    }
                    return item;
                }
            })
        );
    };

    const onPortfolioUpdate = (data: { portfolio: number[] }) => {
        setPortfolio(data.portfolio);
    };

    // Get initial data

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const marketData = await fetchMarketData();
            setMarketData(marketData);

            const portfolioData = await fetchPortfolioData();
            if (portfolioData) {
                setPortfolio(portfolioData);
            }

            await fetchRoundData();
            setLoading(false);
        };
        getData();
    }, [router]);

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
        <div className="aboslute w-full h-full min-h-screen bg-[#232323]">
            {/* Loader */}
            {(loading || socketLoading) && <Loader />}

            {/* Main Content */}
            <div
                className={`my-10 container w-[85vw] h-[85vh] py-20 px-auto px-2 text-center relative z-10 mx-auto transition-all duration-300 rounded-lg ${selectedGraph !== null ? 'blur-md pointer-events-none scale-99' : ''}`}>
                <h1 className="text-4xl font-extrabold mb-6 text-black drop-shadow-md">
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500"
                        style={{ fontFamily: "GreaterTheory" }}
                    >
                        USER DASHBOARD
                    </span>
                </h1>

                {/* Main Content Container */}
                <div className="flex flex-row gap-2 w-full justify-center h-[50vh] overflow-y-auto scrollbar-hide ">
                    {/* Left Section */}
                    <div className="w-2/3 bg-[#BB2121] p-2 rounded-xl overflow-y-auto scrollbar-hide">
                        <h2
                            className="text-2xl font-bold mb-4 text-white text-center uppercase tracking-wider"
                            style={{ fontFamily: "GreaterTheory" }}
                        >
                            MARKET PRICE
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                            {marketData.map((element, index) => (
                                <div
                                    key={element.id}
                                    className="bg-white rounded-md p-2 cursor-pointer hover:shadow-lg transition-all duration-300"
                                    onClick={() => openGraph(index)}
                                >
                                    <div className="h-[150px] w-full">
                                        <Line
                                            data={{
                                                labels: element.marketHistory ? Array(element.marketHistory.length).fill('') : [],
                                                datasets: [
                                                    {
                                                        label: `${element.name}`,
                                                        data: element.marketHistory || [element.marketPrice],
                                                        borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                                        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
                                                        tension: 0.1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: false,
                                                    },
                                                    x: {
                                                        display: false
                                                    }
                                                },
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="font-semibold">{element.name}</p>
                                        <p className={element.marketHistory && element.marketHistory.length > 1 ?
                                            (element.marketHistory[element.marketHistory.length - 1] >= element.marketHistory[element.marketHistory.length - 2] ?
                                                "text-green-600 font-bold" : "text-red-600 font-bold") :
                                            "font-bold"
                                        }>
                                            ₹{element.marketPrice?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-1/3 bg-[#BB2121] px-6 rounded-xl">
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
                                        <td className="border-2 border-[#BB2121] px-4 py-2">{portfolio[index] ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-5 flex justify-center gap-10">
                    <button
                        onClick={handleGoBack}
                        className="px-8 py-3 text-white transition-all duration-300 shadow-lg active:shadow active:translate-y-1 flex items-center bg-[#B82121] rounded-lg hover:bg-[#8a1919] hover:shadow-md hover:scale-105  font-extrabold tracking-widest"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                    {showSell && <SellButton />}
                </div>

            </div>
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
                                labels: marketData[selectedGraph].marketHistory ?
                                    Array(marketData[selectedGraph].marketHistory.length).fill('') : [],
                                datasets: [
                                    {
                                        label: `${marketData[selectedGraph].name} Market Price`,
                                        data: marketData[selectedGraph].marketHistory || [marketData[selectedGraph].marketPrice],
                                        borderColor: `hsl(${selectedGraph * 60}, 70%, 50%)`,
                                        backgroundColor: `hsla(${selectedGraph * 60}, 70%, 50%, 0.2)`,
                                        tension: 0.1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                    },
                                    x: {
                                        display: false
                                    }
                                }
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