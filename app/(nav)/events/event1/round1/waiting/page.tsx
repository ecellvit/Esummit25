'use client'

import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const WaitingPage: FC = () => {
  const router=useRouter();

  const fetchRoundData = async () => {
    const response = await fetch("/api/event1/getPageDetails", { method: "GET" });

    if (response.status === 200) {
      const { round, page, startedAt } = await response.json();

      // Convert startedAt (ISO format) to timestamp
      const startTime = new Date(startedAt).getTime();
      const currentTime = Date.now();

      const timePassed = Math.floor((currentTime - startTime) / 1000);

      if ( round === 1 ) {
        if ( page === 0 ) {
          router.push('/events/event1/round1/start');
        } else if ( page === 1 && timePassed < 10 * 60 ) {
          router.push('/events/event1/round1/primary')
        } else if ( page === 2 && timePassed < 10 * 60 ) {
          router.push('/events/event1/round1/lease1&secondary')
        } else if ( page === 3 && timePassed < 5 * 60 ) {
          router.push('/events/event1/round1/lease2&upgrade')
        }
      } else {
        router.push('/events/event1/leaderDashboard');
      }
    } else {
      router.refresh();
    }
  }

  useEffect(() => {
    fetchRoundData();
  }, [router]);

  return (
    <main className="text-white flex justify-center items-center h-screen z-10">
      <div className="border p-10 bg-red-800 rounded-xl flex flex-col items-center w-5/6 text-center">
        <h1 className="text-2xl p-6 leading-3 font-[PoppinsSemibold]">
          Congratulations on completing this Phase of First Round!
        </h1>
        <h1 className="text-2xl p-6 font-[PoppinsRegular]">
          Please wait while the other participants complete the phase.
        </h1>
        <h1 className="text-2xl p-6 font-[PoppinsRegular]">
          Stay tuned for further updates from our anchors.
        </h1>
      </div>
    </main>
  );
};

export default WaitingPage;