"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface PioneiraDisclaimerModelProps {
  onClose: () => void;
}

const PioneiraDisclaimerModel: React.FC<PioneiraDisclaimerModelProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-[90%] max-w-md relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Success Message */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-green-700">
         Successfully Registered for Pioneira!
        </h2>

        <p className="text-gray-700 text-center mt-2">
        You have registered successfully!<br></br>
        Along with Pioneira, your team will be provided with exclusive access to E-Talk and Achievers’ Conclave.

        </p>

        {/* Events List
        <div className="mt-4 space-y-2 text-center">
          <div className=" p-2 rounded-lg">
            1. Achiever's Conclave
          </div>
          <div className=" p-2 rounded-lg">2. E-Talk</div>
        </div> */}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default PioneiraDisclaimerModel;
