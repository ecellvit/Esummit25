"use client";
import React, { useState, useEffect } from 'react';
import Loader from '@/components/loader';

const Batch = () => {
  const [batch, setBatch] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/event1/round2/getFormData`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setBatch(data.batch); 
        } else {
          setError(data.message || "Error fetching batch data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Server Error: Unable to fetch batch.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <nav
      className="fixed top-12 left-[50%] h-[8vh]
        rounded-lg md:rounded-2xl border-2 border-white-700 shadow-xl z-20
        transition-transform duration-300 transform -translate-x-1/2 
         bg-gradient-to-br from-[#B82121] to-[#000000] bg-opacity-100 text-md lg:text-lg mt-10"
    >
      <div className="flex items-center justify-center h-full lg:px-8">
          <div className="text-white px-4 py-2 rounded-lg font-[GreaterTheory]">
            Batch: {batch} {/* ✅ Displays the batch number */}
          </div>
      </div>
    </nav>
  );
};

export default Batch;
