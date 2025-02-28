"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Round2Form from "@/components/events/round2/component";
import Link from "next/link";

type FormEntry = {
  id: number;
  element: string;
  quantity: number;
  transport: "Air" | "Water";
  batch: number;
  warning?: string;
};

type IslandData = {
  [key: string]: FormEntry[];
};

const initialState: IslandData = {
  island1: [],
  island2: [],
  island3: [],
  island4: [],
};

export default function Testing() {
  const [islandData, setIslandData] = useState<IslandData>(initialState);

  useEffect(() => {
    const savedData = localStorage.getItem("islandData");
    console.log('saved data',savedData)
    if (savedData) {
      setIslandData(JSON.parse(savedData));
    }
  }, []);

  const updateData = (islandId: string, newData: FormEntry[]) => {
    const savedData = localStorage.getItem("islandData");
    const updatedData = savedData ? JSON.parse(savedData) : {};
    updatedData[islandId] = newData;
    localStorage.setItem("islandData", JSON.stringify(updatedData));
    
    // ✅ Instead of directly calling setData, let useEffect handle updates
};


  return (
    <div
      className="relative w-full h-full min-h-screen"
      style={{
        background:
          "radial-gradient(63.7% 63.7% at 50% 50%, #35C0FB 0%, #126E9D 100%)",
      }}
    >
      <Image
        src={island0}
        alt="island0"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 w-auto h-64 object-cover z-10 animate-float"
        priority
      />

      {["island1", "island2", "island3", "island4"].map((island, index) => (
        <Link key={island} href={`./${island}`}>
          <Image
            src={{ island1, island2, island3, island4 }[island]}
            alt={island}
            className={`absolute ${
              index === 0 ? "top-16 left-20" :
              index === 1 ? "top-28 right-48" :
              index === 2 ? "bottom-20 left-60" : "bottom-12 right-44"
            } w-auto h-48 object-cover z-10 animate-float`}
            priority
          />
        </Link>
      ))}

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
