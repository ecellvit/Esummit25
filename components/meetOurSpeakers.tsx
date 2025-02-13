import React from 'react';

const MeetOurSpeakers: React.FC = () => {
  return (
    <section id="speakers" className="relative w-full flex flex-col items-center justify-center bg-white overflow-hidden mt-7">
      {/* Wrapper for Background Text & Main Title */}
      <div className="relative w-full flex flex-col items-center justify-center pt-24 pb-40">
        {/* Background Text */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vw] whitespace-nowrap overflow-hidden">
          <h1 
            className="uppercase text-[12rem] md:text-[14rem] lg:text-[16rem] font-bold tracking-widest leading-none text-center"
            style={{
              color: 'transparent',
              WebkitTextStroke: '3px rgba(176, 81, 25, 0.22)',
              opacity: '0.9',
            }}
          >
            SPEAKERS
          </h1>
        </div>
        
        {/* Main Title */}
        <h1 className="relative uppercase text-6xl md:text-6xl lg:text-8xl font-bold text-[#E46B26] z-10 text-center mb-3 mt-[-1rem]">
          MEET OUR SPEAKERS
        </h1>
      </div>
      {/* Coming Soon Box */}
      <div className="min-h-72 w-full flex items-center justify-center rounded-lg bg-[#BA551B] z-10">
        <h1 className="uppercase text-5xl md:text-6xl lg:text-7xl font-GreaterTheory font-bold text-white text-center">
          COMING SOON!
        </h1>
      </div>
    </section>
  );
};

export default MeetOurSpeakers;
