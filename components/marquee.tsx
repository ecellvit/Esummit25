import React from "react";
import Marquee from "react-fast-marquee";
import image1 from "../assets/close.jpg";
import image2 from "../assets/hamburger.jpg";

// Define the interface with no default values
interface MarqProps {
  speed1?: number;
  speed2?: number;
  speed3?: number;
  speed4?: number;
}

const Marq: React.FC<MarqProps> = ({
  speed1 = 100, // Default value if no speed is passed
  speed2 = 25,
  speed3 = 75,
  speed4 = 50,
}) => {
  return (
    <div className="pt-20"> {/* Adjust the padding-top based on navbar height */}
      {/* Marquee with dynamic speeds */}
      <Marquee speed={speed1} className="bg-white overflow-hidden">
        <div className="flex gap-10 h-20 bg-white text-black justify-around font-bold text-lg md:text-xl leading-normal select-none">
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image1.src} alt="logo 1" className="h-16 mx-7" />
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image2.src} alt="logo 2" className="h-16 mx-7" />
        </div>
      </Marquee>

      <Marquee speed={speed2} className="bg-white overflow-hidden">
        <div className="flex gap-10 h-20 bg-white text-black justify-around font-bold text-lg md:text-xl leading-normal select-none">
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image1.src} alt="logo 1" className="h-16 mx-7" />
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image2.src} alt="logo 2" className="h-16 mx-7" />
        </div>
      </Marquee>

      <Marquee speed={speed3} className="bg-white overflow-hidden">
        <div className="flex gap-10 h-20 bg-white text-black justify-around font-bold text-lg md:text-xl leading-normal select-none">
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image1.src} alt="logo 1" className="h-16 mx-7" />
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image2.src} alt="logo 2" className="h-16 mx-7" />
        </div>
      </Marquee>

      <Marquee speed={speed4} className="bg-white overflow-hidden">
        <div className="flex gap-10 h-20 bg-white text-black justify-around font-bold text-lg md:text-xl leading-normal select-none">
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image1.src} alt="logo 1" className="h-16 mx-7" />
          <span className="flex items-center font-bold h-full text-3xl">
            <b>Our Sponsors</b>
          </span>
          <img src={image2.src} alt="logo 2" className="h-16 mx-7" />
        </div>
      </Marquee>
    </div>
  );
};

export default Marq;
