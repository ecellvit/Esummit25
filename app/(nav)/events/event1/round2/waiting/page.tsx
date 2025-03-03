'use client'

import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import Loader from '@/components/loader';

const WaitingPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<Boolean>(true);

  // const fetchRoundData = async () => {
  //   setLoading(true);
  //   const response1 = await fetch("/api/event1/getPageDetails", { method: "GET" });
  //   const response2 = await fetch("/api/event1/userInfo", { method: "GET" });

  //   if (response1.status === 200 && response2.status === 200) {
  //     const { round, page, startedAt } = await response1.json();
  //     const { team } = await response2.json();

  //     const startTime = new Date(startedAt).getTime();
  //     const currentTime = Date.now();

  //     const timePassed = Math.floor((currentTime - startTime) / 1000);

  //     if ( round === 2 ) {
  //       if ( page === 0 ) {
  //         router.push('/events/event1/round2/start');
  //       } else if ( page === 1 && timePassed < 25 * 60) {
  //         router.push('/events/event1/round2/phase1')
  //       } else if ( page === 2 && timePassed < 25 * 60) {
  //         router.push('/events/event1/round2/phase2')
  //       }
  //     } else {
  //       router.push('/events/event1/leaderDashboard');
  //     }
  //   } else {
  //     router.refresh();
  //   }
  //   setLoading(false);
  // }

  // useEffect(() => {
  //   fetchRoundData();
  // }, [router]);

  return (
    <main className="text-white flex justify-center items-center h-screen z-10">
      {/* {loading && <Loader />} */}
      <div className="border p-10 bg-red-800 rounded-xl flex flex-col items-center w-5/6 text-center">
        <h1 className="text-2xl p-6 leading-3 font-[PoppinsSemibold]">
          Congratulations on completing this Phase 1 of Round 2!
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
