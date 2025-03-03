"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Round2Form from "@/components/events/round2/component";
import Island1Invoice from "@/components/events/round2/island1Invoice1";

type FormEntry = {
    id: number;
    element: string;
    quantity: number;
    transport: "Air" | "Water";
    batch: number;
    warning?: string;
};

const resources = [
    { id: 0, name: "Lithium", cost: 14000, rate: 12, base: 1313 },
    { id: 1, name: "Iron", cost: 13000, rate: 14, base: 1082 },
    { id: 2, name: "Cobalt", cost: 18000, rate: 6, base: 2795 },
    { id: 3, name: "Nickel", cost: 15000, rate: 9, base: 1757 },
    { id: 4, name: "Copper", cost: 20000, rate: 11, base: 1543 }
];

export default function Island1Page() {
    const islandId = "island1";
    const [data, setData] = useState<FormEntry[]>([]);
    const [selectedBox, setSelectedBox] = useState<"own" | "local" | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [availableResources, setAvailableResources] = useState<number[]>([]);
    const [selectedResources, setSelectedResources] = useState<number[]>([]);

    useEffect(() => {
        const savedData = localStorage.getItem("islandData");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData[islandId] || []);
        } else {
            setData([]);
        }
        console.log("Island1Page rendered with data:", data);

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/event1/round2/getPhase2SellData?islandNumber=0`);
                if (response.ok) {
                    const result = await response.json();
                    console.log("Fetched data:", result);
                    setAvailableResources(result.resourcesAvailable);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error while fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleGoBack = () => {
        setTimeout(() => {
            window.history.back();
        }, 500);
    };

    const handleBoxClick = (box: "own" | "local") => {
        setSelectedBox(box);
        setDropdownVisible((prev) => !prev);
    };

    const handleCancel = () => {
        setDropdownVisible(false);
    };

    const handleConfirm = async () => {
        if (selectedBox) {
            const refineryType = selectedBox;
            const islandNumber = 0;
            try {
                const response = await fetch(`/api/event1/round2/setRefineryData?islandNumber=${islandNumber}&refineryData=${refineryType}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.ok) {
                    console.log(`Request sent successfully for ${refineryType}`);
                    await fetch(`/api/event1/round2/setRefineryClick`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ islandNumber }),
                    });
                } else {
                    console.error("Failed to send request");
                }
            } catch (error) {
                console.error("Error while sending request:", error);
            }
        }
        setDropdownVisible(false);
    };

    const handleResourceSelection = (resourceId: number) => {
        setSelectedResources((prev) =>
            prev.includes(resourceId)
                ? prev.filter((id) => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    const handleSubmitSelection = async () => {
        try {
            const response = await fetch(`/api/event1/round2/submitResources`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ selectedResources }),
            });

            if (response.ok) {
                console.log("Resources submitted successfully");
            } else {
                console.error("Failed to submit resources");
            }
        } catch (error) {
            console.error("Error while submitting resources:", error);
        }
    };

    return (
        <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
            <div className="mt-36"> 
                <Island1Invoice data={data} />
            </div>
            <div className="mt-8 w-full max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Resources</h2>
    <div className="flex justify-center">
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4 w-1/2">
  {availableResources.filter((quantity) => quantity > 0).length === 0 ? (
    <p className="text-center text-gray-600">No resources available</p>
  ) : (
    availableResources.map((quantity, index) => {
      if (quantity > 0) {
        const resource = resources.find((res) => res.id === index);
        return (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              selectedResources.includes(index)
                ? "bg-blue-50 border border-blue-500"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id={`resource-${index}`}
                checked={selectedResources.includes(index)}
                onChange={() => handleResourceSelection(index)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`resource-${index}`}
                className="text-lg font-medium text-gray-800"
              >
                {resource?.name}
              </label>
            </div>
            <p className="text-sm text-gray-600">
              {quantity} tons available
            </p>
          </div>
        );
      }
      return null;
    })
  )}
  </div>
</div>
    <div className="mt-6 flex justify-center">
        <button
            onClick={handleSubmitSelection}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
            Submit
        </button>
    </div>
</div>
            <div className="bottom-4 left-1/2 transform flex justify-center mt-8">
                <button
                    onClick={handleGoBack}
                    className="px-8 py-3 text-white transition-all duration-300 shadow-lg active:shadow active:translate-y-1 flex items-center bg-black rounded-lg hover:shadow-md hover:scale-105 font-extrabold tracking-widest"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                </button>
            </div>
        </div>
    );
}