import React from "react";

const MeetOurSpeakers: React.FC = () => {
  return (
    <section
      id="speakers"
      className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden mt-7"
    >
      {/* Wrapper for Background Text & Main Title */}
      <div className="relative min-h-72 w-full flex flex-col items-center justify-center pt-24 pb-40">
        {/* Background Moving Text */}
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap">
          <div className="flex w-max animate-speakersMarquee">
            {/* Two identical lines for seamless looping */}
            {[...Array(2)].map((_, i) => (
              <h1
                key={i}
                className="uppercase text-[10rem] md:text-[12rem] lg:text-[14rem] font-bold tracking-widest leading-none text-center mx-10"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(176, 81, 25, 0.22)",
                }}
              >
                MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS &nbsp; MEET OUR SPEAKERS
              </h1>
            ))}
          </div>
        </div>

        {/* Main Title */}
        <h1 className="relative uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-[#E46B26] z-10 text-center mb-3 mt-[5rem]">
          MEET OUR SPEAKERS
        </h1>
      </div>

      {/* Coming Soon Box */}
      <div className="min-h-72 w-full flex items-center justify-center rounded-t-3xl bg-[#BA551B] z-10">
        <h1 className="uppercase text-5xl md:text-6xl lg:text-7xl font-GreaterTheory font-bold text-white text-center">
          COMING SOON!
        </h1>
      </div>
    </section>
  );
};

export default MeetOurSpeakers;
