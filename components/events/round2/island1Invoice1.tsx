"use client";
import React, { useEffect, useState } from "react";
import { calculatePrice } from "./priceUtils"; // Import the utility function

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
        const response = await fetch(`/api/event1/round2/getTransportCount`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error("Failed to parse JSON:", text);
          throw new Error("Invalid JSON response from server");
        }

        if (data.success) {
          setCount(data.count);
        } else {
          setError(data.message || "Error fetching count");
        }
      } catch (err) {
        console.error("Error fetching count:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine if the count is within the range 9-12
  const shouldApplyIncrease = count !== null && count >= 9 && count <= 12;

  // Extract the market prices from invoiceData
  const marketPrices = invoiceData.map((item) => item.marketPrice);

  // Calculate adjusted prices (returns an array)
  const adjustedPrices = calculatePrice(marketPrices, count);

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
                <td className="border p-2">
                  ₹
                  {shouldApplyIncrease
                    ? adjustedPrices[index].toLocaleString() // Use adjusted price
                    : item.marketPrice.toLocaleString()} {/* Use original price */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Island1Invoice;