"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function Testing() {
    const router = useRouter();
    const [lease1Timer, setLease1Timer] = useState(300);
    const [secondaryTimer, setSecondaryTimer] = useState(600);
    const [lease1Expired, setLease1Expired] = useState(false);
    const [secondaryExpired, setSecondaryExpired] = useState(false);

    // Check if the round has started/finished
    const getPageData = async () => {
        const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

        if (response.status === 200) {
            const { round, page, startedAt } = await response.json();

            // Convert startedAt (ISO format) to timestamp
            const startTime = new Date(startedAt).getTime();
            const currentTime = Date.now();

            const timePassed = Math.floor((currentTime - startTime) / 1000);
            setLease1Timer(5 * 60 - timePassed);
            setSecondaryTimer(10 * 60 - timePassed);

            if (round !== 1 || page !== 2 || (timePassed > 10 * 60 * 1000)) {
                if (round <= 1 && page > 2) {
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
    }
    
    const checkStatus = async () => {
        try {
            const response = await fetch("/api/event1/userInfo", { method: "GET" });
            if (response.status === 200) {
                const {team} = await response.json();
                const lease1 = team.lease1Element;
                const secondary = team.secondaryElement;
                if (lease1 >= 0 && lease1 <= 4) {
                    setLease1Expired(true);
                }
                if (secondary >= 0 && secondary <= 4) {
                    setSecondaryExpired(true);
                }
            }
        } catch (error) {
            console.log("Error fetching team details:", error);
        }
    }

    useEffect(() => {
        getPageData();
        checkStatus();
    }, []);
    
    useEffect(() => {
        const lease1Interval = setInterval(() => {
            setLease1Timer(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(lease1Interval);
                    setLease1Expired(true);
                    toast.error("Lease 1 time expired!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        const secondaryInterval = setInterval(() => {
            setSecondaryTimer(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(secondaryInterval);
                    setSecondaryExpired(true);
                    toast.error("Secondary time expired!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => {
            clearInterval(lease1Interval);
            clearInterval(secondaryInterval);
        };
    }, []);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderLease1Card = () => {
        const cardContent = (
            <div className={`rounded-lg overflow-hidden ${!lease1Expired ? 'cursor-pointer transition-transform duration-300 hover:scale-105' : 'opacity-75'}`} style={{ padding: '8px' }}>
                <div className="bg-white rounded-t-lg p-6">
                    <h2 
                        className="text-3xl font-bold text-center" 
                        style={{ 
                            fontFamily: 'Poppins', 
                            color: lease1Expired ? '#888888' : '#BB2121' 
                        }}
                    >
                        LEASE 1
                    </h2>
                </div>
                <div 
                    className={`p-6 text-white rounded-b-lg`} 
                    style={{ 
                        backgroundColor: lease1Expired ? '#888888' : '#BB2121',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    <p className="text-sm">
                    The lease agreement allows them to extract additional elements at a premium rate. It as 
                    a special permission that costs a bit more but opens up new opportunities for resource 
                    diversity.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div 
                            className="bg-white px-6 py-2 rounded-md font-bold text-xl" 
                            style={{ 
                                fontFamily: 'Poppins',
                                color: lease1Expired ? '#888888' : '#BB2121' 
                            }}
                        >
                            {formatTime(lease1Timer)}
                        </div>
                    </div>
                </div>
            </div>
        );
        if (lease1Expired) {
            return <div className="w-full md:w-1/2 max-w-md">{cardContent}</div>;
        } else {
            return <Link href="./lease1" className="w-full md:w-1/2 max-w-md">{cardContent}</Link>;
        }
    };

    const renderSecondaryCard = () => {
        const cardContent = (
            <div className={`rounded-lg overflow-hidden ${!secondaryExpired ? 'cursor-pointer transition-transform duration-300 hover:scale-105' : 'opacity-75'}`} style={{ padding: '8px' }}>
                <div className="bg-white rounded-t-lg p-6">
                    <h2 
                        className="text-3xl font-bold text-center" 
                        style={{ 
                            fontFamily: 'FontSpring', 
                            color: secondaryExpired ? '#888888' : '#BB2121' 
                        }}
                    >
                        SECONDARY ELEMENT
                    </h2>
                </div>
                <div 
                    className={`p-6 text-white rounded-b-lg`} 
                    style={{ 
                        backgroundColor: secondaryExpired ? '#888888' : '#BB2121',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    <p className="text-sm">
                    Mining for the Secondary Element gives you ownership right , to mine and extract an 
                    additional resource.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div 
                            className="bg-white px-6 py-2 rounded-md font-bold text-xl" 
                            style={{ 
                                fontFamily: 'Poppins',
                                color: secondaryExpired ? '#888888' : '#BB2121' 
                            }}
                        >
                            {formatTime(secondaryTimer)}
                        </div>
                    </div>
                </div>
            </div>
        );
        if (secondaryExpired) {
            return <div className="w-full md:w-1/2 max-w-md">{cardContent}</div>;
        } else {
            return <Link href="./secondary" className="w-full md:w-1/2 max-w-md">{cardContent}</Link>;
        }
    };
    
    return (
        <div className="absolute w-full h-full min-h-screen bg-[#232323]">
            <div className="mt-20 container w-[85vw] h-[85vh] py-10 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-y-auto scrollbar-hide">
                <h1 className="text-4xl font-extrabold my-6 text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500" style={{ fontFamily: 'GreaterTheory' }}>
                        Lease 1
                    </span>
                    &nbsp; <span className="text-3xl text-red-500">or</span> &nbsp;
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800" style={{ fontFamily: 'GreaterTheory' }}>
                        Secondary
                    </span>
                </h1>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-8">
                    {renderLease1Card()}
                    {renderSecondaryCard()}
                </div>
            </div>
            <Toaster />
        </div>
    );
}