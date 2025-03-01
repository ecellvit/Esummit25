"use client";
import React, { useState, useEffect } from 'react';
import { set } from 'mongoose';

const Batch = () => {
  const [batch, setBatch] = useState("Batch 1");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await fetch('/api/event1/round2/batch');
        const data = await response.json();
        if (response.ok)
          setBatch("Batch " + data.batch);
        else
            setError(data.message);
      } catch (error) {
        console.error("Error Fetching :", error);
        setError("Server Error");
      }
    };
    fetchBatch();
  }, []);

  return (
    <nav
      className="fixed top-12 left-[50%] h-[8vh]
        rounded-lg md:rounded-2xl border-2 border-white-700 shadow-xl z-20
        transition-transform duration-300 transform -translate-x-1/2 
         bg-gradient-to-br from-[#B82121] to-[#000000] bg-opacity-100 text-md lg:text-lg mt-10"
    >
      <div className="flex items-center justify-center h-full lg:px-8">
        <div className="text-white px-4 py-2 rounded-lg" style={{ fontFamily: 'GreaterTheory' }}>
          {batch}
        </div>
      </div>
    </nav>
  );
};

export default Batch;