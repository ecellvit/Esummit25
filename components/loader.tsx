"use client";

export default function Loader() {

  return (
    <div className="flex justify-center items-center h-screen w-screen absolute z-10">
      <div
        className="rounded-full w-[50px] h-[50px]  animate-spin transition-all duration-500 ease-in-out border-red-500 border-t-4 border-l-4"
      ></div>
    </div>
  );
}