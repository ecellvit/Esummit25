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
import Loader from "@/components/loader";
import { set } from "mongoose";
import toast, { Toaster } from "react-hot-toast";
import { initializeSocket, socket } from "@/socket";

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

type TransportData = {
  batch: number;
  mode: string;
  island: number;
  time: number;
}[];

export default function Testing() {
  const [islandData, setIslandData] = useState<IslandData>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [batchTime, setBatchTime] = useState<number>(0);
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
  const [transportData, setTransportData] = useState<TransportData | null>(null);
  
  const startPlaneAnimation = (islandNumber: string, duration: number) => {
    setShowPlanes(prev => ({ ...prev, [islandNumber]: true }));
    setTimeout(() => setShowPlanes(prev => ({ ...prev, [islandNumber]: false })), duration);
  };
  const startShipAnimation = (islandNumber: string, duration: number) => {
    setShowShips(prev => ({ ...prev, [islandNumber]: true }));
    setTimeout(() => setShowShips(prev => ({ ...prev, [islandNumber]: false })), duration);
  };

  useEffect(() => {
    const savedData = localStorage.getItem("islandData");
    console.log('saved data', savedData)
    if (savedData) {
      setIslandData(JSON.parse(savedData));
    }

    // Fetch transport data on component mount
    
    // fetchTransportData();
  }, []);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = React.useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
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
    setSubmitClicked(true);
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
  };

  const handleCloseInsurance = () => {
    setShowInsurance(false);
    setSubmitClicked(false);
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
      setLoading(true);
      const data = await response.json();
      console.log(data);
      localStorage.removeItem("islandData");
      console.log("Local storage cleared after successful API response.");

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

  const handleSkipButtonClick = () => {
    setShowSkipConfirmation(true);
  };

  const handleSkipConfirmYes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/event1/round2/skipBatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.removeItem("islandData");
        console.log("Local storage cleared after successful API response.");
      } else {
        console.log('Error', response.status);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setShowSkipConfirmation(false);
      setLoading(false);
    }
  };

  const handleSkipConfirmNo = () => {
    setShowSkipConfirmation(false);
  };

  const handleConfirmDispatchYes = () => {
    const fetchTransportData = async () => {
      try {
        const response = await fetch('/api/event1/round2/transportInfo');
        if (response.ok) {
          const data = await response.json();
          setTransportData(data.dataArray);
          setBatchTime(data.maxTime);
          console.log(data);
          localStorage.removeItem("islandData");
          console.log("Local storage cleared after successful API response.");
        } else {
          console.error("Failed to fetch transport data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching transport data:", error);
      }
    };
    if (transportData) {
      transportData.forEach(item => {
        const islandNumber = `island${item.island}`;
        const duration = item.time * 1000;
        if (item.mode === "plane") {
          startPlaneAnimation(islandNumber, duration);
        } else if (item.mode === "ship") {
          startShipAnimation(islandNumber, duration);
        }
      });
    }
  };
  const updateData = (islandId: string, newData: FormEntry[]) => {
    const savedData = localStorage.getItem("islandData");
    const updatedData = savedData ? JSON.parse(savedData) : {};
    updatedData[islandId] = newData;
    localStorage.setItem("islandData", JSON.stringify(updatedData));
  };

  const handleSaveInvoice = async() => {
    // setShowInvoice(false);
    setLoading(true);
    try{

      const response = await fetch('/api/event1/round2/submitFormData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ })
      });
      if(response.ok){
        setLoading(true);
        const data = await response.json();
        console.log(data);
        localStorage.removeItem("islandData");
        console.log("Local storage cleared after successful API response.");
  
      }else{
        console.log('Error',response.status);
      }
    }catch(err){
      console.log(err)
    }finally{
      setShowInvoice(false);
      setLoading(false);
    }
    toast.success("Invoice saved successfully!");
  };

  const onCalamityUpdate = (island: number) => {
    console.log(`Calamity occurred on island ${island}!`);
    // Update UI or perform any necessary actions here
  }

  const [socketLoading, setSocketLoading] = useState<boolean>(true);

  // Socket Setup
  useEffect(() => {
    // Initial connection status check
    console.log("Socket connection status:", socket.connected);

    if (socket.connected) {
      setSocketLoading(false);
      onConnect();
    }

    async function setupSocket() {
      const result = await initializeSocket();

      if (!result.success) {
        setSocketLoading(true);
        setupSocket();
      }

      setSocketLoading(false);
    }

    if (!socket.connected) {
      setupSocket();
    }

    function onConnect() {
      socket.io.engine.on("upgrade", (transport) => {
        console.log("upgrade ::", transport.name);
      });
    }

    function onDisconnect(reason: string) {
      console.warn("Socket disconnected:", reason);
      if (reason === "ping timeout" || reason === "transport error") {
        socket.connect(); // Try reconnecting manually
      }
    }

    socket.on("connect", onConnect);
    socket.on("calamityUpdate", onCalamityUpdate);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.on("calamityUpdate", onCalamityUpdate);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket.connected]);

  return (
    <div
      className="relative w-full h-full min-h-screen"
    >
      {/* Center Island */}
      {(loading || socketLoading) && <Loader />}
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
            style={{
              animationDuration: transportData?.find(item => `island${item.island}` === island)?.time + 's'
            }}
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
            style={{
              animationDuration: transportData?.find(item => `island${item.island}` === island)?.time + 's'
            }}
          />
        )
      )}

      <div className="absolute bottom-10 z-100">
        <button
          className="p-2 text-white font-bold rounded-lg bg-green-500 ml-8 hover:bg-green-700 w-32 text-center"
          onClick={handleConfirmDispatchYes}>
          Dispatch
        </button>
      </div>

      {/* CSS for animations - make sure class names match exactly what's used above */}
      <style jsx global>{`
        @keyframes flyToIsland1 { 
          from { transform: translate(-200%, -50%); }
          to { transform: translate(-1000%, -400%); }
        }
        .animate-fly-to-island1 {
          animation: flyToIsland1 1s linear forwards;
        }
        @keyframes flyToIsland2 {
          from { transform: translate(200%, -50%); }
          to { transform: translate(650%, -250%); }
        }
        .animate-fly-to-island2 {
          animation: flyToIsland2 1s linear forwards;
        }
        @keyframes flyToIsland3 {
          from { transform: translate(-150%, 80%); }
          to { transform: translate(-760%, 240%); }
        }
        .animate-fly-to-island3 {
          animation: flyToIsland3 1s linear forwards;
        }
        @keyframes flyToIsland4 {
          from { transform: translate(160%, 75%); }
          to { transform: translate(780%, 280%); }
        }
        .animate-fly-to-island4 {
          animation: flyToIsland4 1s linear forwards;
        }
      `}</style>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          className="p-2 text-white font-bold rounded-lg bg-green-500 ml-8 hover:bg-green-700 w-32 text-center"
          onClick={handleButtonClick}
          disabled={submitClicked}
        >
          Submit
        </button>
        <button
          className="p-2 text-white font-bold rounded-lg bg-red-500 ml-8 hover:bg-red-700 w-32 text-center"
          onClick={handleSkipButtonClick}
          disabled={submitClicked}
        >
          Skip
        </button>
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
            <InsuranceComponent handleConfirmInsurance={handleConfirmInsurance} setSelectedInsurance={setSelectedInsurance} selectedInsurance={selectedInsurance} loading={loading} />
            <button
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-black py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
              onClick={handleCloseInsurance}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl min-w-fit text-center transform transition-all duration-300 scale-105">
            {loading && <Loader />}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
            <div className="mb-6 text-gray-600 text-left ">
              <Invoice />
            </div>
            <div className="flex justify-center">
            <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={()=>setShowInvoice(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 flex justify-center text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleSaveInvoice}
              >
                {loading?<span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>:"Confirm and Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSkipConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Skip Confirmation</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to skip this batch?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleSkipConfirmNo}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
                onClick={handleSkipConfirmYes}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}