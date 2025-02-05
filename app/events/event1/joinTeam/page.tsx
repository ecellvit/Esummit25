"use client";
import { useState } from "react";

export default function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="bg-[#141B2B] text-white opacity-[85%] h-[80vh] w-[90vw] md:h-[80vh] md:w-[80vw] lg:h-[80vh] lg:w-[40vw] rounded-md flex flex-col items-center justify-around portrait:lg:w-[90vw] portrait:lg:h-[70vh]">
        <div className="hidden md:block lg:block text-center font-bold text-white text-[4vh] lg:text-[5vh]">
          Join the Team
        </div>
        <div className="lg:h-[30vh] flex flex-col items-center justify-center lg:w-[25vw]">
          <div className="flex flex-col justify-evenly items-center gap-5">
            <input
              type="text"
              placeholder="Enter team code"
              className="border border-black sm:landscape:w-[20vw] sm:landscape:h-[7vh] md:max-w-[40vw] portrait:md:max-w-[40vw] portrait:lg:w-[30vw] portrait:lg:text-2xl lg:w-[15vw] w-[55vw] h-[5vh] rounded-md text-xl text-slate-900 focus:outline-none focus:placeholder-transparent active:scale-95 transition-all duration-300"
            />
            <button
              onClick={handleButtonClick}
              className="mb-7 sm:landscape:w-[15vw] rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 text-center portrait:lg:w-[30vw] md:max-w-[25vw] md:text-[1.6vh] sm:landscape:md:text-[1.7vh] lg:w-[15vw] w-[50vw] h-[5vh] hover:scale-110 active:scale-95 transition-transform ease-in-out duration-300"
            >
              Join the team
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md text-center">
            <p className="mb-4">Would you like to join Team Name?</p>
            <div className="flex justify-around">
              <button
                onClick={handleCloseModal}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
