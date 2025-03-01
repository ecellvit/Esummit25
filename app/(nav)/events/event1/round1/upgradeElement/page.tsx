// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import bg from "/assets/scrollBg.svg";

// interface Upgrade {
//     id: number;
//     name: string;
//     cost: number;
//     description: string;
// }

// function UpgradeCard({ upgrade, onBuy }: { upgrade: Upgrade; onBuy: () => void }) {
//     return (
//         <div 
//             onClick={onBuy} 
//             className="flex flex-col items-center justify-between p-6 border border-red-700 rounded-xl shadow-xl bg-gradient-to-br from-[#C72423] to-[#8A1A19] hover:from-[#8A1A19] hover:to-[#510D0D] text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden w-full"
//         >
//             <div className="absolute top-0 right-0 w-16 h-16 bg-red-800 rotate-45 translate-x-8 -translate-y-8 opacity-50"></div>
//             <p className="text-xl font-bold uppercase tracking-wider">Upgrade {upgrade.id}</p>
//             <p className="text-lg font-semibold">{upgrade.name}</p>
//             <div className="w-full h-px bg-gradient-to-r from-transparent via-red-300 to-transparent my-2"></div>
//             <p className="text-md font-medium">Cost: <span className="font-bold">₹ {upgrade.cost.toLocaleString()}</span></p>
//             <button className="mt-4 px-6 py-2 bg-white text-red-800 font-bold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md active:scale-95">
//                 Upgrade
//             </button>
//         </div>
//     );
// }

// export default function Testing() {
//     // Fixed upgrade data as specified
//     const upgrades: Upgrade[] = [
//         { id: 1, name: "Mining Efficiency", cost: 5000, description: "Increases mining output" },
//         { id: 2, name: "Workforce Management", cost: 6000, description: "Improves worker productivity" },
//         { id: 3, name: "Machinery Upgradation", cost: 4000, description: "Enhances machinery performance" }
//     ];
    
//     const [selectedUpgrade, setSelectedUpgrade] = useState<Upgrade | null>(null);

//     const handleConfirmPurchase = () => {
//         if (selectedUpgrade) {
//             console.log("Upgrade confirmed:", {
//                 id: selectedUpgrade.id,
//                 name: selectedUpgrade.name,
//                 cost: selectedUpgrade.cost
//             });
//             setSelectedUpgrade(null);
//         }
//     };
    

//     const handleGoBack = () => {
//         console.log("Going back to previous page");
//     };
    
//     return (
//         <div className="relative w-full h-full min-h-screen bg-gray-100">
//             {/* Background */}
//             <div className="fixed inset-0 overflow-hidden">
//                 <Image 
//                     src={bg} 
//                     alt="bg" 
//                     className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 transform scale-110" 
//                     priority
//                 />
//                 <div className="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-900/10 to-gray-900/30 z-1"></div>
//             </div>
            
//             {/* Main Content */}
//             <div className={`container mx-auto p-10 text-center relative z-10 transition-all duration-300 ${selectedUpgrade ? 'blur-md pointer-events-none scale-99' : ''}`}>
//                 <h1 className="text-4xl font-extrabold mb-8 mt-24 text-black drop-shadow-md">
//                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500">
//                         Choose Performance Upgrade
//                     </span>
//                 </h1>
//                 <h6 className="text-lg font-medium text-gray-800 mb-8">
//                     Choose wisely, as this upgrade will affect your performance for next 10 minutes.
//                 </h6>
                
//                 {/* Fixed 3-column grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
//                     {upgrades.map((upgrade) => (
//                         <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => setSelectedUpgrade(upgrade)} />
//                     ))}
//                 </div>
                
//                 {/* Go Back Button */}
//                 <div className="mt-16 mb-10 flex justify-center">
//                     <button 
//                         onClick={handleGoBack}
//                         className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:shadow active:translate-y-1 flex items-center"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                         </svg>
//                         Go Back
//                     </button>
//                 </div>
//             </div>
            
//             {/* Modal */}
//             {selectedUpgrade && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300">
//                     <div className="bg-white p-8 shadow-2xl text-center w-full max-w-md mx-4 transform transition-all duration-500 border-4 border-red-900 rounded-2xl">
//                         <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Upgrade</h2>
//                         <div className="bg-gray-50 p-6 rounded-xl mb-6 shadow-inner">
//                             <p className="text-xl font-bold text-red-700 mb-2">Upgrade {selectedUpgrade.id}</p>
//                             <p className="text-2xl font-bold text-gray-800 mb-4">{selectedUpgrade.name}</p>
//                             <div className="flex justify-between items-center px-4">
//                                 <p className="text-gray-600 font-medium">Cost:</p>
//                                 <p className="text-xl font-bold">₹ {selectedUpgrade.cost.toLocaleString()}</p>
//                             </div>
//                         </div>
//                         <div className="mt-6 flex justify-center gap-6">
//                             <button 
//                                 onClick={() => setSelectedUpgrade(null)} 
//                                 className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:shadow active:translate-y-1"
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={handleConfirmPurchase}
//                                 className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:shadow active:translate-y-1"
//                             >
//                                 Confirm
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";
import Loader from "@/components/loader";
import { initializeSocket, socket } from "@/socket";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface Upgrade {
    id: number;
    name: string;
    cost: number;
    description: string;
}

function UpgradeCard({ upgrade, onBuy }: { upgrade: Upgrade; onBuy: () => void }) {
    return (
        <div 
            onClick={onBuy}
            className="flex flex-col items-center justify-between p-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden w-full"
            style={{
                border: '4.662px solid #FFF',
                background: 'linear-gradient(114deg, rgba(232, 232, 232, 0.10) 15.11%, rgba(187, 33, 33, 0.08) 81.96%)',
                boxShadow: '0px 9.324px 18.649px 0px rgba(0, 0, 0, 0.20), 0px 5.328px 0px 0px rgba(0, 0, 0, 0.20)',
                fontFamily: 'Poppins'
            }}
        >
            <p className="text-xl font-bold uppercase tracking-wider">Upgrade {upgrade.id}</p>
            <p className="text-lg font-semibold">{upgrade.name}</p>
            <div className="w-full h-1 bg-[#BB2121] my-3 "></div>
            <p className="text-md text-black font-medium">
                Cost: <span className="font-bold text-black">₹ {upgrade.cost.toLocaleString()}</span>
            </p>
            <button
                className="mt-4 px-6 py-2 bg-[#B82121] text-white rounded-lg transition-all duration-300 hover:bg-[#8a1919] hover:shadow-md hover:scale-105  font-extrabold tracking-widest"
                style={{
                    fontFamily: 'FontSpring',
                }}
            >
                UPGRADE
            </button>
        </div>
    );
}

export default function Testing() {
    const upgrades: Upgrade[] = [
        { id: 1, name: "Mining Efficiency", cost: 5000, description: "Increases mining output" },
        { id: 2, name: "Workforce Management", cost: 6000, description: "Improves worker productivity" },
        { id: 3, name: "Machinery Upgradation", cost: 4000, description: "Enhances machinery performance" }
    ];
    
    const router = useRouter();
    const [selectedUpgrade, setSelectedUpgrade] = useState<Upgrade | null>(null);
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [socketLoading, setSocketLoading] = useState<Boolean>(true);

    // Check if the round has started/finished
    const getPageData = async () => {
        setLoading(true);
        const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

        if (response.status === 200) {
            const { round, page, startedAt } = await response.json();

            // Convert startedAt (ISO format) to timestamp
            const startTime = new Date(startedAt).getTime();
            const currentTime = Date.now();

            if (round !== 1 || page !== 3 || (currentTime - startTime > 5 * 60 * 1000)) {
                if (round <= 1 && page > 3) {
                    toast.error("This round is over.");
                } else {
                    toast.error("This round has not started yet.");
                }
                router.push(`/events/event1/round1/waiting`);
                return;
            }
        } else {
            router.refresh();
            console.log(response);
        }
        setLoading(false);
    }

    useEffect(() => {
        getPageData();
    }, []);

    useEffect(() => {
        const fetchRate = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/get-rate");
                const data = await response.json();
                setRate(data.primaryRate);
            } catch (error) {
                console.log("Error fetching rate:", error);
            }
            setLoading(false);
        };
        fetchRate();
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
        socket.on("disconnect", onDisconnect);

        return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        };
    }, [socket.connected]);

    const handleUpgrade = async () => {
        if (!selectedUpgrade) return;
        setLoading(true);
        try {
            const response = await fetch("/api/event1/round1/upgradeElement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ upgradeLevel: selectedUpgrade.id }),
            });

            const data = await response.json();     
            if (response.ok) {
                setSelectedUpgrade(null)
                setRate(data.newRate);
                socket.emit("upgrade");
                toast.success("Upgraded successfully")
            } else {
                setSelectedUpgrade(null);
                toast.error(data.message || "Upgrade failed");
                console.log("Error updating rate:", data.message);
            }
        } catch (error) {
            console.log("Error:", error);
        }
        setLoading(false);
    };
    const handleGoBack = () => {
        console.log("Going back to previous page");
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    return (
        <div className="aboslute w-full h-full min-h-screen bg-[#232323]">
            {/* Loader */}
            {(loading || socketLoading) && <Loader/>}

            <div className={`my-10 container w-[85vw] h-[85vh] py-20 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-y-auto scrollbar-hide ${selectedUpgrade ? 'blur-md pointer-events-none scale-99' : ''}`}>
                <h1 className="text-4xl font-extrabold my-6 text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500" style={{ fontFamily: 'GreaterTheory' }}>
                        Performance Upgrade
                    </span>
                </h1>
                <h6 className="text-lg font-medium text-gray-800 mb-6" style={{ fontFamily: 'FontSpring' }} >
                    This upgrade will affect your performance for the next 10 minutes.
                </h6>
                
                <p className="text-xl font-bold mb-8" style={{ fontFamily: 'FontSpring' }} >
                    Current Rate: {rate !== null ? rate : "Loading..."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
                    {upgrades.map((upgrade) => (
                        <UpgradeCard key={upgrade.id} upgrade={upgrade} onBuy={() => setSelectedUpgrade(upgrade)} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
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
            </div>
            

            {/* Modal */}
            {selectedUpgrade && (
                <div className="fixed inset-0 flex items-center justify-center bg-red-900 bg-opacity-10 backdrop-blur-md z-50 transition-all duration-300">
                    <div
                        className="text-center w-[80%] max-w-2xl mx-4 transform transition-all duration-500 rounded-3xl overflow-hidden border-white border-4 "
                        style={{ background: "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)" }}>
                        <h2 className="text-xl font-bold my-8 pt-6 text-white" style={{ fontFamily: 'GreaterTheory' }}>Do You Want To Upgrade The Item ?</h2>
                        <div
                            className="overflow-hidden w-[60%] mx-auto"
                            style={{ fontFamily: 'Poppins' }}
                        >
                            <div className="bg-[#380F0F] py-3">
                                <p className="text-xl font-bold text-white">CONFIRM UPGRADE</p>
                            </div>
                            <div
                                className="bg-white p-6"
                            >
                                <p className="text-3xl font-bold mb-4" style={{
                                    background: "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>{selectedUpgrade.name}</p>
                                <div className="flex justify-between items-center mb-3 px-4">
                                    <p className="text-gray-600 font-medium text-xl">Cost:</p>
                                    <p className="text-2xl font-bold" style={{
                                        background: "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}>₹{selectedUpgrade.cost.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="my-8 flex justify-center gap-12 pb-6"
                            style={{ fontFamily: 'FontSpring' }}
                        >
                            <button
                                onClick={() => setSelectedUpgrade(null)}
                                className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpgrade}
                                className="px-8 py-4 text-white font-bold rounded-md"
                                style={{ background: "linear-gradient(180deg, #BB2121 0%, #550F0F 100%)" }}
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
