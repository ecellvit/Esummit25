import React from "react";

const Sponsors: React.FC = () => {
  return (
    <section
      id="speakers"
      className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Coming Soon Box */}
      <div className="relative min-h-72 w-full flex items-center justify-center rounded-b-3xl bg-[#BA551B] z-10 overflow-hidden">
        {/* Background Moving Text */}
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-marquee">
            {/* Two identical lines for seamless looping */}
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
                }}
              >
                SPONSORS &nbsp; SPONSORS &nbsp; SPONSORS &nbsp; SPONSORS
              </h1>
            ))}
          </div>
        </div>

        <h1 className="uppercase text-5xl md:text-6xl lg:text-7xl font-GreaterTheory font-bold text-white text-center relative z-10">
          SPONSORS
        </h1>
      </div>

      {/* Wrapper for Main Title */}
      <div className="relative w-full flex flex-col items-center justify-center pt-24 pb-40">
        {/* Main Title */}
        <h1 className="relative uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-[#E46B26] z-10 text-center mb-3 mt-[-1rem]">
          COMING SOON!
        </h1>
      </div>
    </section>
  );
};

export default Sponsors;
