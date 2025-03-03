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

  // Function to calculate the adjusted market price
  const calculatePrice = (price: number): number => {
    if (count === null) return price;

    let increasePercentage = 0;

    switch (count) {
      case 12:
        increasePercentage = 20;
        break;
      case 11:
        increasePercentage = 18;
        break;
      case 10:
        increasePercentage = 16;
        break;
      case 9:
        increasePercentage = 14;
        break;
      default:
        increasePercentage = 0;
    }

    const adjustedPrice = Math.round(price * (1 + increasePercentage / 100));
    console.log(`Original Price: ${price}, Adjusted Price: ${adjustedPrice}`); // Log prices
    return adjustedPrice;
  };

  // Determine if the count is within the range 9-12
  const shouldApplyIncrease = count !== null && count >= 9 && count <= 12;
  console.log("Should apply increase:", shouldApplyIncrease); // Log this condition

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
                  ₹{shouldApplyIncrease ? calculatePrice(item.marketPrice).toLocaleString() : item.marketPrice.toLocaleString()}
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