"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bg from "/assets/round1/bg2.svg";
import resourceData from "@/constant/round1/element.json";
import { CloudCog } from "lucide-react";
import { socket } from "@/socket";
import toast, { Toaster } from "react-hot-toast";

interface Resource {
    id: number;
    name: string;
    cost: number;
    rate: number;
}

function ResourceCard({ resource, onBuy }: { resource: Resource; onBuy: () => void }) {
    return (
        // <div 
        //     onClick={onBuy} 
        //     className="flex flex-col items-center justify-between p-6 border border-red-700 rounded-xl shadow-xl bg-[#E8E8E8] hover:from-[#8A1A19]  hover:to-[#510D0D]  transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden w-full"
        // >
        //     <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#BB2121] to-[#E8E8E8] blur-xl rotate-45 translate-x-8 -translate-y-8 opacity-70"></div>
        //     <p className="text-xl text-bold uppercase text-[#BB2121] tracking-wider">{resource.name}</p>
        //     <div className="w-full h-px bg-gradient-to-r from-transparent via-red-300 to-transparent my-2"></div>
        //     <p className="text-md text-black font-medium">Cost: <span className="font-bold">₹ {resource.cost.toLocaleString()}</span></p>
        //     <p className="text-md text-black font-medium">Rate: <span className="font-bold">{resource.rate}</span> ton/min</p>
        //     <button className="mt-4 px-6 py-2 bg-[#B82121] text-white-800 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md active:scale-95"style={{ fontFamily: 'FontSpring' }} >
        //         BUY
        //     </button>
        // </div>
        <div 
        onClick={onBuy} 
        className="flex flex-col items-center justify-between p-6 border border-red-700 rounded-xl shadow-xl bg-[#E8E8E8] hover:from-[#8A1A19] hover:to-[#510D0D] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden w-full">
  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#BB2121] to-[#E8E8E8] blur-xl rotate-45 translate-x-8 -translate-y-8 opacity-80"></div>

  <p className="text-xl font-bold uppercase text-[#BB2121] tracking-wider">
    {resource.name}
  </p>

  <div className="w-full h-1 bg-[#BB2121] my-3 "></div>

  <p className="text-md text-black font-medium">
    Cost: <span className="font-bold text-black">{resource.cost.toLocaleString()}</span>
  </p>
  <p className="text-md text-black font-medium">
    Rate: <span className="font-bold">{resource.rate}</span> ton/min
  </p>

  <button
    className="mt-4 px-6 py-2 bg-[#B82121] text-white rounded-lg transition-all duration-300 hover:bg-gray-100 hover:text-black hover:shadow-md active:scale-95"
    style={{ fontFamily: 'FontSpring' }}
  >
    BUY
  </button>
</div>

    );
}

export default function Testing() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // Connect to socket server
    
    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }
    
        function onConnect() {
            socket.io.engine.on("upgrade", (transport) => {
                console.log("upgrade ::", transport);
            });
        }

        function onDisconnect() {
            console.log("User Disconnected");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        };
    }, []);


    // Load JSON data directly
    useEffect(() => {
        setResources(resourceData);
    }, []);

    const handleConfirmPurchase = async () => {
        if (selectedResource) {
            try {
                const response = await fetch("/api/event1/round1/primaryelement", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        elementId: selectedResource.id,
                        elementRate: selectedResource.rate
                    }),
                });
    
                const result = await response.json();
                console.log("sdfghjkl",response.status);
    
                if (response.ok) {
                    setSelectedResource(null);
                    console.log("Purchase successful:", result);
                    toast.success("Purchase Successfully"); //socket.emit("purchase", element) // Get MV on the socket server, emit it back
                    socket.emit("purchase", selectedResource.id);
                } else {
                    setSelectedResource(null);
                    console.log("Purchase failed:", result.message);
                    toast.error(` ${result.message}`)
                }
    
                setSelectedResource(null);
            } catch (error) {
                console.log("Error during purchase:", error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };
    
    
    return (
        <div className="relative w-full h-full min-h-screen bg-gray-100">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden">
                <Image 
                    src={bg} 
                    alt="bg" 
                    className="absolute inset-0 w-full h-full object-cover z-0 transform scale-110" 
                    priority
                />
                <div className="absolute inset-0 opacity-100 bg-gradient-to-b from-gray-900/10 to-gray-900/20 z-1"></div>
            </div>
            
            {/* Main Content */}
            <div className={`mt-10 container w-[90%] p-10 text-center relative z-10 bg-white mx-auto transition-all duration-300 ${selectedResource ? 'blur-md pointer-events-none scale-99' : ''}`}>
                <h1 className="text-4xl font-extrabold mb-8 mt-24 text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500" style={{ fontFamily: 'GreaterTheory' }}>
                        Primary Element
                    </span>
                </h1>
                <h6 className="text-lg font-medium text-gray-800 mb-8"style={{ fontFamily: 'FontSpring' }} >
                    Choose wisely, as this will be your primary element for the entire Round 1.
                </h6>
                
                {/* Unified Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 max-w-6xl mx-auto">
                    {resources.map((res) => (
                        <ResourceCard key={res.id} resource={res} onBuy={() => setSelectedResource(res)} />
                    ))}
                </div>
            </div>
            
            {/* Modal */}
            {selectedResource && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300">
                    <div className="bg-white p-8 shadow-2xl text-center w-full max-w-md mx-4 transform transition-all duration-500 border-4 border-red-900 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Purchase</h2>
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-inner">
                            <p className="text-2xl font-bold text-red-700 mb-4">{selectedResource.name}</p>
                            <div className="flex justify-between items-center mb-3 px-4">
                                <p className="text-gray-600 font-medium">Cost:</p>
                                <p className="text-xl font-bold">₹ {selectedResource.cost.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <p className="text-gray-600 font-medium">Rate:</p>
                                <p className="text-xl font-bold">{selectedResource.rate} ton/min</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center gap-6">
                            <button 
                                onClick={() => setSelectedResource(null)} 
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:shadow active:translate-y-1"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmPurchase}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:shadow active:translate-y-1"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Toaster/>
        </div>
    );
}
