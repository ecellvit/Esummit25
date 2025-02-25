"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from 'next/link';

export default function Testing() {
    const [lease2Timer, setLease2Timer] = useState(300);
    const [upgradeTimer, setUpgradeTimer] = useState(300);
    const [lease2Expired, setLease2Expired] = useState(false);
    const [upgradeExpired, setUpgradeExpired] = useState(false);
    
    useEffect(() => {
        const lease2Interval = setInterval(() => {
            setLease2Timer(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(lease2Interval);
                    setLease2Expired(true);
                    toast.error("Lease 2 time expired!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        const upgradeInterval = setInterval(() => {
            setUpgradeTimer(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(upgradeInterval);
                    setUpgradeExpired(true);
                    toast.error("Upgrade time expired!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => {
            clearInterval(lease2Interval);
            clearInterval(upgradeInterval);
        };
    }, []);

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const renderLease2Card = () => {
        const cardContent = (
            <div className={`rounded-lg overflow-hidden ${!lease2Expired ? 'cursor-pointer transition-transform duration-300 hover:scale-105' : 'opacity-75'}`} style={{ padding: '8px' }}>
                <div className="bg-white rounded-t-lg p-6">
                    <h2 
                        className="text-3xl font-bold text-center" 
                        style={{ 
                            fontFamily: 'FontSpring', 
                            color: lease2Expired ? '#888888' : '#BB2121' 
                        }}
                    >
                        LEASE 2
                    </h2>
                </div>
                <div 
                    className={`p-6 text-white rounded-b-lg`} 
                    style={{ 
                        backgroundColor: lease2Expired ? '#888888' : '#BB2121',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    <p className="text-sm">
                        Lorem Ipsum is simply dummy text of the printing and 
                        typesetting industry. Lorem Ipsum has been the industry's 
                        standard dummy text ever since the 1500s.Lorem Ipsum is 
                        simply dummy text of the printing and typesetting 
                        industry. Lorem Ipsum has been the industry's standard 
                        dummy text ever since the 1500s.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div 
                            className="bg-white px-6 py-2 rounded-md font-bold text-xl" 
                            style={{ 
                                fontFamily: 'FontSpring',
                                color: lease2Expired ? '#888888' : '#BB2121' 
                            }}
                        >
                            {formatTime(lease2Timer)}
                        </div>
                    </div>
                </div>
            </div>
        );
        if (lease2Expired) {
            return <div className="w-full md:w-1/2 max-w-md">{cardContent}</div>;
        } else {
            return <Link href="./lease2" className="w-full md:w-1/2 max-w-md">{cardContent}</Link>;
        }
    };

    const renderUpgradeCard = () => {
        const cardContent = (
            <div className={`rounded-lg overflow-hidden ${!upgradeExpired ? 'cursor-pointer transition-transform duration-300 hover:scale-105' : 'opacity-75'}`} style={{ padding: '8px' }}>
                <div className="bg-white rounded-t-lg p-6">
                    <h2 
                        className="text-3xl font-bold text-center" 
                        style={{ 
                            fontFamily: 'FontSpring', 
                            color: upgradeExpired ? '#888888' : '#BB2121' 
                        }}
                    >
                        UPGRADE
                    </h2>
                </div>
                <div 
                    className={`p-6 text-white rounded-b-lg`} 
                    style={{ 
                        backgroundColor: upgradeExpired ? '#888888' : '#BB2121',
                        fontFamily: 'Poppins, sans-serif'
                    }}
                >
                    <p className="text-sm">
                        Lorem Ipsum is simply dummy text of the printing and 
                        typesetting industry. Lorem Ipsum has been the industry's 
                        standard dummy text ever since the 1500s.Lorem Ipsum is 
                        simply dummy text of the printing and typesetting 
                        industry. Lorem Ipsum has been the industry's standard 
                        dummy text ever since the 1500s.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <div 
                            className="bg-white px-6 py-2 rounded-md font-bold text-xl" 
                            style={{ 
                                fontFamily: 'Poppins',
                                color: upgradeExpired ? '#888888' : '#BB2121' 
                            }}
                        >
                            {formatTime(upgradeTimer)}
                        </div>
                    </div>
                </div>
            </div>
        );
        if (upgradeExpired) {
            return <div className="w-full md:w-1/2 max-w-md">{cardContent}</div>;
        } else {
            return <Link href="./upgradeElement" className="w-full md:w-1/2 max-w-md">{cardContent}</Link>;
        }
    };
    
    return (
        <div className="absolute w-full h-full min-h-screen bg-[#232323]">
            <div className="mt-20 container w-[85vw] h-[85vh] py-10 px-auto text-center relative z-10 mx-auto transition-all duration-300 rounded-lg overflow-y-auto scrollbar-hide">
                <h1 className="text-4xl font-extrabold my-6 text-black drop-shadow-md">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-800 to-red-500" style={{ fontFamily: 'GreaterTheory' }}>
                        Lease 2
                    </span>
                    &nbsp; <span className="text-3xl text-red-500">or</span> &nbsp;
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-800" style={{ fontFamily: 'GreaterTheory' }}>
                        Upgrade
                    </span>
                </h1>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-8">
                    {renderLease2Card()}
                    {renderUpgradeCard()}
                </div>
            </div>
            <Toaster />
        </div>
    );
}