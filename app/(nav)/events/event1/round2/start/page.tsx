"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import bg from "/assets/round2/bg1.svg";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function Testing() {
    const router=useRouter();
    const [loading, setLoading] = useState<Boolean>(true);

    const fetchRoundData = async () => {
        setLoading(true);
        const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

        if (response.status === 200) {
            const { round, page, startedAt } = await response.json();

            // Convert startedAt (ISO format) to timestamp
            const startTime = new Date(startedAt).getTime();
            const currentTime = Date.now();

            const timePassed = Math.floor((currentTime - startTime) / 1000);

            if ( round === 2 ) {
                if ( page === 1 && timePassed < 25 * 60 ) {
                    router.push('/events/event1/round2/phase1')
                } else if ( page === 2 && timePassed < 25 * 60 ) {
                    router.push('/events/event1/round2/phase2')
                } else if ( page === 3 && timePassed < 10 * 60 ) {
                    router.push('/events/event1/round2/phase2sell')
                } else if ( page !== 0 ) {
                    router.push('/events/event1/round2/waiting');
                }
            } else {
                router.push('/events/event1/leaderDashboard');
            }
        } else {
            router.refresh();
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchRoundData();
    }, [router]);
    
    return (
        <div className="relative w-full h-full min-h-screen bg-gray-100">
            {loading && <Loader />}
            
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden">
                <Image
                    src={bg}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover z-0 transform scale-110"
                    priority
                />
            </div>

            {/* Main Content */}
            <div className="font-[GreaterTheory] flex items-center justify-center min-h-screen">
                <div className="relative w-[80%] md:w-[60%] lg:w-[50%] py-20 px-6 sm:px-8 md:px-12 mx-4 bg-white rounded-lg text-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.2),inset_0_8px_16px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_12px_24px_rgba(0,0,0,0.3)]">
                    <h1 className="text-6xl font-bold text-red-800 mb-4 break-words">INNOVENTURE</h1>
                    <h2 className="text-3xl text-gray-800 mb-8">ROUND 2</h2>
                    <Link 
                        href="./phase1"
                        className="px-6 py-4 text-xl mt-12 font-semibold text-white bg-red-800 rounded-full shadow-md hover:bg-red-700 active:bg-red-900 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-inner"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
                    >
                        Enter
                    </Link>
                </div>
            </div>
        </div>
    );
}
