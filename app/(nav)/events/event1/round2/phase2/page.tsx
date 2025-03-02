"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import ship from "/assets/round2/ship.svg";
import plane from "/assets/round2/plane.svg";
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
  const [showPlanes, setShowPlanes] = useState({
    island1: false,
    island2: false,
    island3: false,
    island4: false
  });
  const [showShips, setShowShips] = useState({
    island1: false,
    island2: false,
    island3: false,
    island4: false
  });
  
  useEffect(() => {
    const savedData = localStorage.getItem("islandData");
    console.log('saved data', savedData)
    if (savedData) {
      setIslandData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Center Island */}
      <Image
        src={island0}
        alt="island0"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 w-auto h-64 object-cover z-10 animate-float"
        priority
      />

      {["island1", "island2", "island3", "island4"].map((island, index) => (
        <Link key={island} href={`./phase2island${index + 1}`}>
          <Image
            src={{ island1, island2, island3, island4 }[island]}
            alt={island}
            className={`absolute ${index === 0 ? "top-16 left-20" :
              index === 1 ? "top-28 right-48" :
                index === 2 ? "bottom-20 left-60" : "bottom-12 right-44"
              } w-auto h-48 object-cover z-10 animate-float`}
            priority
          />
        </Link>
      ))}
    </div>
  );
}
