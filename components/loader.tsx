"use client";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-full absolute z-10 bg-black bg-opacity-50">
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute w-16 h-16 border-4 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin"></div>

        {/* Inner glow effect */}
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-800 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
