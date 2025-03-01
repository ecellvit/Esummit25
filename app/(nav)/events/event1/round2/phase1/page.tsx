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
import Invoice from "@/components/events/round2/invoice";
import Link from "next/link";
import InsuranceComponent from "./insuranceComponent";

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
  const startPlaneAnimation = (islandNumber: string) => {
    setShowPlanes(prev => ({ ...prev, [islandNumber]: true }));
    setTimeout(() => setShowPlanes(prev => ({ ...prev, [islandNumber]: false })), 3000);
  };
  const startShipAnimation = (islandNumber: string) => {
    setShowShips(prev => ({ ...prev, [islandNumber]: true }));
    setTimeout(() => setShowShips(prev => ({ ...prev, [islandNumber]: false })), 3000);
  }

  useEffect(() => {
    const savedData = localStorage.getItem("islandData");
    console.log('saved data', savedData)
    if (savedData) {
      setIslandData(JSON.parse(savedData));
    }
  }, []);

  const updateData = (islandId: string, newData: FormEntry[]) => {
    const savedData = localStorage.getItem("islandData");
    const updatedData = savedData ? JSON.parse(savedData) : {};
    updatedData[islandId] = newData;
    localStorage.setItem("islandData", JSON.stringify(updatedData));
  };
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showConfirmDispatch, setShowConfirmDispatch] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = React.useState("");
  const [loading,setLoading] = useState<boolean>(false);
  const insuranceOptions = [
    'No Insurance (Cost - 0)', 
    'Basic Plan (Cost - 15,000)', 
    'Premium Plan (Cost - 30,000)', 
    'Platinum Plan (Cost - 60,000)'
  ];

  const handleButtonClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false);
    setShowInsurance(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDispatchNo = () => {
    setShowConfirmDispatch(false);
  };

  const handleConfirmDispatchYes = () => {
    setShowConfirmDispatch(false);
  };

  const handleCloseInsurance = () => {
    setShowInsurance(false);
  };

  const handleConfirmInvoice = () => {
    setShowInvoice(false);
    setShowConfirmDispatch(true);
  };

  const handleConfirmInsurance = async() => {
    setLoading(true);
    try{

    const response = await fetch('/api/event1/round2/setFormData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          islandData: islandData,
          insurance: selectedInsurance
          })
    });
    if(response.ok){
      const data = await response.json();
      console.log(data);
    }else{
      console.log('Error',response.status);
    }
  }catch(err){
    console.log(err)
  }finally{
    
    setShowInsurance(false);
    setShowInvoice(true);
    setLoading(false);
  }
  };

  return (
    <div
      className="relative w-full h-full min-h-screen"
    >
      {/* Center Island */}
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
            className={`absolute ${index === 0 ? "top-16 left-20" :
              index === 1 ? "top-28 right-48" :
                index === 2 ? "bottom-20 left-60" : "bottom-12 right-44"
              } w-auto h-48 object-cover z-10 animate-float`}
            priority
          />
        </Link>
      ))}

      {/* Planes with correct animation classes */}
      {Object.entries(showPlanes).map(([island, show]) =>
        show && (
          <Image
            key={`plane-${island}`}
            src={plane}
            alt={`plane-${island}`}
            className={`absolute top-1/2 left-1/2 w-12 h-12 z-20 ${
              island === "island1" ? "animate-fly-to-island1" :
              island === "island2" ? "animate-fly-to-island2" :
              island === "island3" ? "animate-fly-to-island3" :
              "animate-fly-to-island4"
            }`}
          />
        )
      )}

      {/* Ships with correct animation classes */}
      {Object.entries(showShips).map(([island, show]) =>
        show && (
          <Image
            key={`ship-${island}`}
            src={ship}
            alt={`ship-${island}`}
            className={`absolute top-1/2 left-1/2 w-12 h-12 z-20 ${
              island === "island1" ? "animate-fly-to-island1" :
              island === "island2" ? "animate-fly-to-island2" :
              island === "island3" ? "animate-fly-to-island3" :
              "animate-fly-to-island4"
            }`}
          />
        )
      )}

      {/* Dispatch Buttons */}
      <div className="absolute bottom-28 left-72 transform translate-x-1/2 flex space-x-4">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
            onClick={() => startPlaneAnimation(`island${num}`)}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="absolute bottom-28 right-72 transform -translate-x-1/2 flex space-x-4">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
            onClick={() => startShipAnimation(`island${num}`)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* CSS for animations - make sure class names match exactly what's used above */}
      <style jsx global>{`
        @keyframes flyToIsland1 {
          from { transform: translate(-160%, -40%); }
          to { transform: translate(-1820%, -560%); }
        }
        @keyframes flyToIsland2 {
          from { transform: translate(200%, -50%); }
          to { transform: translate(600%, -300%); }
        }
        @keyframes flyToIsland3 {
          from { transform: translate(-150%, 60%); }
          to { transform: translate(-760%, 240%); }
        }
        @keyframes flyToIsland4 {
          from { transform: translate(150%, 50%); }
          to { transform: translate(780%, 280%); }
        }
        .animate-fly-to-island1 {
          animation: flyToIsland1 5s linear forwards;
        }
        .animate-fly-to-island2 {
          animation: flyToIsland2 3s linear forwards;
        }
        .animate-fly-to-island3 {
          animation: flyToIsland3 3s linear forwards;
        }
        .animate-fly-to-island4 {
          animation: flyToIsland4 3s linear forwards;
        }
      `}</style>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        {["Batch 1", "Batch 2", "Batch 3"].map((batch, index) => (
          <button
            key={index}
            className="p-2 text-white font-bold rounded-lg bg-green-500 ml-8 hover:bg-green-700 w-32 text-center"
            onClick={handleButtonClick}
          >
            {batch}
          </button>
        ))}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to proceed with this dispatch?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleConfirmNo}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleConfirmYes}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

{showInsurance && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
      <InsuranceComponent handleConfirmInsurance={handleConfirmInsurance} setSelectedInsurance={setSelectedInsurance} selectedInsurance={selectedInsurance}/>
    </div>
  </div>
)}

      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl min-w-fit text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
            <div className="mb-6 text-gray-600 text-left ">
              <Invoice />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleConfirmInvoice}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDispatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Dispatch</h2>
            <p className="text-gray-600 mb-6">Once you confirm, your dispatch will start and you won't be able to edit it.</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleConfirmDispatchNo}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleConfirmDispatchYes}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}