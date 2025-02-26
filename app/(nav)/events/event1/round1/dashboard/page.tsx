"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import resourceData from "@/constant/round1/element.json";
import dynamic from "next/dynamic";
import "chart.js/auto";
import SellButton from "@/components/events/Round1/SellButton";
import { socket } from "@/socket";
import calculateMarketPrice from "@/utils/calculateMarketPrice";

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
    const [marketData, setMarketData] = useState<ElementData[]>([]);
    const [portfolio, setPortfolio] = useState<number[]>([]);
    const [selectedGraph, setSelectedGraph] = useState<number | null>(null);

    // Socket helper functions
    const onMarketPrice = (data: { elementId: number; marketPrice: number }) => {
        setMarketData((prevMarketData) =>
            prevMarketData.map((item, index) =>
                index === data.elementId
                    ? { ...item, marketPrice: data.marketPrice }
                    : item
            )
        );
    };

    const onPortfolioUpdate = (data: { portfolio: number[] }) => {
        console.log(data);
        setPortfolio(data.portfolio);
    };


    // Connect to socket server
    
    useEffect(() => {
        // Initial connection status check
        console.log("Socket connection status:", socket.connected);
        if (socket.connected) {
            onConnect();
        }

        if (!socket.connected) {
            socket.connect();
        }
    
        function onConnect() {
            socket.io.engine.on("upgrade", (transport) => {
                console.log("upgrade ::", transport.name);
            });
        }

        function onDisconnect() {
            console.log("User Disconnected");
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

    useEffect(() => {
        const getData = async () => {
            const data = await fetchMarketData();
            setMarketData(data);
        };
        getData();
    }, []);

    const openGraph = (index: number) => {
        setSelectedGraph(index);
    };

    const closeGraph = () => {
        setSelectedGraph(null);
    };

    return (
        <div className="absolute w-full h-full min-h-screen bg-[#232323]">
            {/* Main Content */}
            <div
                className={`my-10 container w-[85vw] h-[85vh] px-2 py-20 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-hidden ${
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

                {/* <div className="flex flex-row justify-center ">
                    <button className="bg-red-700 px-10 py-2 rounded-xl font-bold text-white hover:text-red-700 hover:bg-black" onClick={()=> console.log(portfolio)}>Continue</button>
                </div> */}

            </div>

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