"use client";
import React, { useEffect, useState } from "react";

const invoiceData = [
  { metal: "Lithium", marketPrice: 1970 },
  { metal: "Cobalt", marketPrice: 4193 },
  { metal: "Iron", marketPrice: 2315 },
  { metal: "Copper", marketPrice: 1623 },
  { metal: "Nickel", marketPrice: 2636 },
];

const Island1Invoice = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the count from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/event1/round2/getWaterTransportCount`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setCount(data.count);
        } else {
          setError(data.message || "Error fetching count");
        }
      } catch (err) {
        console.error("Error fetching count:", err);
        setError("Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to calculate the adjusted market price
  const calculatePrice = (price: number): number => {
    let increasePercentage = 0;

    if (count === 12) increasePercentage = 20;
    else if (count === 11) increasePercentage = 18;
    else if (count === 10) increasePercentage = 16;
    else if (count === 9) increasePercentage = 14;

    return Math.round(price * (1 + increasePercentage / 100));
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg w-full mx-auto mt-10 bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Invoice - Island Ithaca</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Metal</th>
              <th className="border p-2">Market Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{item.metal}</td>
                <td className="border p-2">₹{calculatePrice(item.marketPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Island1Invoice;
