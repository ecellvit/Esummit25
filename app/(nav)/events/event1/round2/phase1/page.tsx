"use client";
import React, { useState } from "react";
import Image from "next/image";
import island0 from "/assets/round2/island0.svg";
import island1 from "/assets/round2/island1.svg";
import island2 from "/assets/round2/island2.svg";
import island3 from "/assets/round2/island3.svg";
import island4 from "/assets/round2/island4.svg";
import Invoice from "@/components/events/round2/invoice";
import Link from "next/link";

export default function Testing() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showConfirmDispatch, setShowConfirmDispatch] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = React.useState("");

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

  const handleConfirmInsurance = () => {
    setShowInsurance(false);
    setShowInvoice(true);
  };

  return (
    <div
      className="relative w-full h-full min-h-screen"
      style={{
        background:
          "radial-gradient(63.7% 63.7% at 50% 50%, #35C0FB 0%, #126E9D 100%)",
      }}
    >
      {/* Center Island */}
      <Image
        src={island0}
        alt="island0"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 w-auto h-64 object-cover z-10 animate-float"
        priority
      />

      {/* Corner Islands */}
      <Link href="./island1">
        <Image
          src={island1}
          alt="island1"
          className="absolute top-16 left-20 w-auto h-48 object-cover z-10 animate-float-slow"
          priority
        />
      </Link>
      <Link href="./island2">
        <Image
          src={island2}
          alt="island2"
          className="absolute top-28 right-48 w-auto h-48 object-cover z-10 animate-float-fast"
          priority
        />
      </Link>
      <Link href="./island3">
        <Image
          src={island3}
          alt="island3"
          className="absolute bottom-20 left-60 w-auto h-48 object-cover z-10 animate-float-slow"
          priority
        />
      </Link>
      <Link href="./island4">
        <Image
          src={island4}
          alt="island4"
          className="absolute bottom-12 right-44 w-auto h-48 object-cover z-10 animate-float-fast"
          priority
        />
      </Link>

      {/* Broken Lines */}
      <svg className="absolute inset-0 w-full h-full z-0">
        <line x1="50%" y1="50%" x2="15%" y2="20%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="85%" y2="25%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="80%" y2="85%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5,5" />
      </svg>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }

        @keyframes float-fast {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Insurance Type</h2>
      <div className="mb-6 space-y-3">
        {['No Insurance (Cost - 0)', 'Basic Plan (Cost - 15,000)', 'Premium Plan (Cost - 30,000)', 'Platinum Plan (Cost - 60,000)'].map((option, index) => (
          <label key={index} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="insurance" 
              value={option} 
              onChange={(e) => setSelectedInsurance(e.target.value)} 
              className="hidden"
            />
            <div className={`w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center ${selectedInsurance === option ? 'bg-blue-500 border-blue-500' : ''}`}>
              {selectedInsurance === option && <div className="w-3 h-3 rounded-full bg-white"></div>}
            </div>
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <button 
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
          onClick={handleCloseInsurance}
        >
          Cancel
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md"
          onClick={handleConfirmInsurance}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


{showInvoice && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-2xl shadow-2xl min-w-fit text-center transform transition-all duration-300 scale-105">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
      <div className="mb-6 text-gray-600 text-left ">
        <Invoice/>
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