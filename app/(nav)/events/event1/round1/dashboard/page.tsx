"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bg from "/assets/scrollBg.svg";
import dynamic from "next/dynamic";
import "chart.js/auto";

// Dynamically import Chart.js Line component
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
    ssr: false,
});

interface ElementData {
    name: string;
    basePrice: number;
    teamsBought: number;
}

const elements = ["Li", "Be", "B", "C", "N"];

const fetchMarketData = async () => {
    // Replace with actual API endpoint
    const response = await fetch("/api/market-prices");
    const data: ElementData[] = await response.json();
    return data;
};

const calculateMarketPrice = (basePrice: number, teamsBought: number) => {
    return basePrice + ((16 - teamsBought) / 40) * 1.75;
};

const Dashboard: React.FC = () => {
    const [marketData, setMarketData] = useState<ElementData[]>([]);

    useEffect(() => {
        const getData = async () => {
            const data = await fetchMarketData();
            setMarketData(data);
        };
        getData();
    }, []);

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
            <div className="relative z-10 flex flex-col w-full h-full min-h-screen">
                {/* Upper Half - Two Sections */}
                <div className="flex flex-1 p-11 space-x-20">
                    {/* Left Side - Two Stacked Divs */}
                    <div className="w-2/3 space-y-2 rounded-xl">
                        <div className="h-full w-4/5 flex flex-1 p-10 bg-blue-500 rounded-xl mx-auto">
                            <div className="flex flex-col w-full h-full space-y-5">
                                {marketData.map((element, index) => {
                                    const marketPrice = calculateMarketPrice(element.basePrice, element.teamsBought);
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
                    {/* <div className="h-1/2 rounded-xl bg-red-700 flex items-center justify-center text-white font-bold text-2xl">
              CASH
            </div>
            <div className="h-1/2 rounded-xl bg-red-900 flex items-center justify-center text-white font-bold text-2xl">
              DONT KNOW
            </div> */}
                    <div className="w-1/3 p-10  bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                        RESOURCES
                    </div>
                </div>
            </div>

            {/* Lower Half - Full Width Div with 5 Line Charts */}

        </div>
    );
};

export default Dashboard;
