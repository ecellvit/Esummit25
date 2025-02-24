"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bg from "/assets/scrollBg.svg";
import dynamic from "next/dynamic";
import "chart.js/auto";
import resourceData from "@/constant/round1/element.json";
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

const elements = ["Li", "Be", "B", "C", "N"];

const fetchMarketData = async () => {
    // Replace with actual API endpoint
    // const response = await fetch("/api/market-prices");
    // const data: ElementData[] = await response.json();
    const data: ElementData[] = resourceData.map((data, index) => ({
        id: index, 
        name: data.name, 
        basePrice: data.base, 
        teamsBought: 0, 
        marketPrice: calculateMarketPrice(data.base, 0)
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

    // Socket helper functions
    
    const onMarketPrice = (data: {elementId: number, marketPrice: number}) => {
        console.log(data);
        setMarketData(prevMarketData =>
            prevMarketData.map((item, index) =>
                index === data.elementId ? { ...item, marketPrice: data.marketPrice } : item
            )
        );
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
        socket.on("disconnect", onDisconnect);

        return () => {
        socket.off("connect", onConnect);
        socket.off("marketPrice", onMarketPrice);
        socket.off("disconnect", onDisconnect);
        };
    }, [socket.connected]);

    return (
        <div className="relative w-full h-full min-h-screen">
            {/* Background Image */}
            <div className="fixed inset-0 overflow-hidden">
                <Image
                    src={bg}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 transform scale-110"
                    priority
                />
                <div className="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-900/10 to-gray-900/30 z-1"></div>
            </div>

            {/* Dashboard Layout */}
            <div className="relative z-10 flex flex-col w-full h-full min-h-screen space-y-1">
                {/* Upper Half - Two Sections */}
                <h1 className="text-4xl font-extrabold mt-36 text-center  text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-950 to-red-500">
                        USER DASHBOARD
                    </span>
                </h1>
                <div className="flex flex-1 p-8 space-x-28">
                    {/* Left Side - Two Stacked Divs */}
                    <div className="w-2/3 rounded-xl">
                        <div className="h-full flex flex-col pt-9 p-12  bg-red-950 rounded-xl text-white">
                            <h1 className="flex flex-row justify-evenly mb-9 text-3xl font-bold">MARKET PRICE</h1>
                            <div className=" w-full h-full space-y-5 bg-white rounded-xl">
                                {marketData.map((element, index) => {
                                    const marketPrice = element.marketPrice;
                                    const chartData = {
                                        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                                        datasets: [
                                            {
                                                label: `${element.name} Market Price`,
                                                data: [marketPrice, marketPrice * 1.02, marketPrice * 0.98, marketPrice * 1.01, marketPrice * 0.99],
                                                borderColor: `hsl(${index * 60}, 70%, 50%)`,
                                                backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
                                                tension: 0.1,
                                            },
                                        ],
                                    };
                                    return (
                                        <div key={element.name} className="flex-1">
                                            <Line data={chartData} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 p-12 pt-9 bg-red-950 rounded-xl flex flex-col items-center ">
                        <h1 className="justify-evenly mb-9 text-white font-bold text-3xl">RESOURCES</h1>
                        <div className="bg-white w-full rounded-xl">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-black">
                                        <th className="border border-black px-4 py-2 text-left justify-evenly text-white">RESOURCE NAME</th>
                                        <th className="border border-black px-4 py-2 text-left justify-evenly text-white">QUANTITY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resourceData.map((resource, index) => (
                                        <tr key={index} className="odd:bg-gray-100">
                                            <td className="border border-black px-4 py-2">{resource.name}</td>
                                            <td className="border border-black px-4 py-2">{resource.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-5 ">
                            {/* <button
                             onClick={sellResources}
                             className="px-20 py-2 bg-white text-red-950 font-bold rounded-lg hover:bg-red-800 hover:text-white">
                                SELL
                            </button> */}
                            <SellButton />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center ">
                    <button className="bg-red-700 px-10 py-2 rounded-xl font-bold text-white hover:text-red-700 hover:bg-black" onClick={()=> console.log(marketData)}>Continue</button>
                </div>
            </div>

            {/* Lower Half - Full Width Div with 5 Line Charts */}

        </div>
    );
};

export default Dashboard;
