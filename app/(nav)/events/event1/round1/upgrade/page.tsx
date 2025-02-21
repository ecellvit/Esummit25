"use client";
import React, { useState } from "react";
import Image from "next/image";
import bg from "/assets/scrollBg.svg";

interface Upgrade {
    id: number;
    name: string;
    cost: number;
    description: string;
}

function UpgradeCard({ upgrade, onBuy }: { upgrade: Upgrade; onBuy: () => void }) {
    return (
        <div 
            onClick={onBuy} 
            className="flex flex-col items-center justify-between p-6 border border-red-700 rounded-xl shadow-xl bg-gradient-to-br from-[#C72423] to-[#8A1A19] hover:from-[#8A1A19] hover:to-[#510D0D] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden w-full"
        >
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-800 rotate-45 translate-x-8 -translate-y-8 opacity-50"></div>
            <p className="text-xl font-bold uppercase tracking-wider">Upgrade {upgrade.id}</p>
            <p className="text-lg font-semibold">{upgrade.name}</p>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-300 to-transparent my-2"></div>
            <p className="text-md font-medium">Cost: <span className="font-bold">₹ {upgrade.cost.toLocaleString()}</span></p>
            <button className="mt-4 px-6 py-2 bg-white text-red-800 font-bold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md active:scale-95">
                Upgrade
            </button>
        </div>
    );
}

export default function Testing() {
    // Fixed upgrade data as specified
    const upgrades: Upgrade[] = [
        { id: 1, name: "Mining Efficiency", cost: 5000, description: "Increases mining output" },
        { id: 2, name: "Workforce Management", cost: 6000, description: "Improves worker productivity" },
        { id: 3, name: "Machinery Upgradation", cost: 4000, description: "Enhances machinery performance" }
    ];
    
    const [selectedUpgrade, setSelectedUpgrade] = useState<Upgrade | null>(null);

    const handleConfirmPurchase = () => {
        if (selectedUpgrade) {
            console.log("Upgrade confirmed:", {
                id: selectedUpgrade.id,
                name: selectedUpgrade.name,
                cost: selectedUpgrade.cost
            });
            setSelectedUpgrade(null);
        }
    };
    
    const handleGoBack = () => {
        console.log("Going back to previous page");
    };
    
    return (
        <div className="relative w-full h-full min-h-screen bg-gray-100">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden">
                <Image 
                    src={bg} 
                    alt="bg" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 transform scale-110" 
                    priority
                />
                <div className="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-900/10 to-gray-900/30 z-1"></div>
            </div>
            
            {/* Main Content */}
            <div className={`container mx-auto p-10 text-center relative z-10 transition-all duration-300 ${selectedUpgrade ? 'blur-md pointer-events-none scale-99' : ''}`}>
                <h1 className="text-4xl font-extrabold mb-8 mt-24 text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500">
                        Choose Performance Upgrade
                    </span>
                </h1>
                <h6 className="text-lg font-medium text-gray-800 mb-8">
                    Choose wisely, as this upgrade will affect your performance for next 10 minutes.
                </h6>
                
                {/* Fixed 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
                    {upgrades.map((upgrade) => (
                        <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => setSelectedUpgrade(upgrade)} />
                    ))}
                </div>
                
                {/* Go Back Button */}
                <div className="mt-16 mb-10 flex justify-center">
                    <button 
                        onClick={handleGoBack}
                        className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:shadow active:translate-y-1 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back
                    </button>
                </div>
            </div>
            
            {/* Modal */}
            {selectedUpgrade && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300">
                    <div className="bg-white p-8 shadow-2xl text-center w-full max-w-md mx-4 transform transition-all duration-500 border-4 border-red-900 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Upgrade</h2>
                        <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-inner">
                            <p className="text-xl font-bold text-red-700 mb-2">Upgrade {selectedUpgrade.id}</p>
                            <p className="text-2xl font-bold text-gray-800 mb-4">{selectedUpgrade.name}</p>
                            <div className="flex justify-between items-center px-4">
                                <p className="text-gray-600 font-medium">Cost:</p>
                                <p className="text-xl font-bold">₹ {selectedUpgrade.cost.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center gap-6">
                            <button 
                                onClick={() => setSelectedUpgrade(null)} 
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
        </div>
    );
}