import React from 'react';
import Card from "../../../components/PatronsCard";
import Image from "next/image";
import chancellor from "@/public/assets/patrons/chanchellore.jpg";
import kanchana from "@/public/assets/patrons/kanchana.png";
import naiju from "@/public/assets/patrons/naiju.png";
import partha from "@/public/assets/patrons/partha.png";
import ramesh from "@/public/assets/patrons/ramesh.png";
import sankar from "@/public/assets/patrons/sankar.png";
import sekar from "@/public/assets/patrons/sekar.png";
import selvam from "@/public/assets/patrons/selvam.png";
import pradheep from "@/public/assets/patrons/pradheep.png";
import barathi from "@/public/assets/patrons/barathi.jpg";



const Page: React.FC = () => {
  return (
    <section className="bg-[#0E0E0E] pt-20 px-16 min-h-screen font-poppins p-0 m-0 box-border">
      <h1 className="uppercase mt-10 mb-5 text-4xl md:text-5xl lg:text-7xl text-center font-bold bg-gradient-to-br  bg-clip-text text-transparent" 
     style={{
      background:
        "linear-gradient(90deg, #8A0407 3.01%, #FF6261 18.13%, #DE2726 31.78%, #9C2929 55.42%, #FB4C4B 68.04%, #AC0605 93.31%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
      >
        <span className="text-white">our</span> patrons
      </h1>
      <div className="flex flex-col items-center pt-6">
        <div className=" h-[22rem] w-64 m-4 bg-gradient-to-br from-[#DCA64E] via-[#FEFAB7] to-[#D6993F] rounded-lg " style={{background:"white"}}>
          <div className="overflow-hidden h-2/3 rounded-lg">
            <Image className="h-full w-full" src={chancellor} alt="Chancellor" />
          </div>
          <div className="text-black h-1/3 flex flex-col justify-center">
            <h1 className="text-center text-2xl font-bold leading-tight">
              Dr. G Vishwanathan
            </h1>
            <h1 className="text-center text-xl font-semibold leading-tight">
              Honorable Chancellor
            </h1>
          </div>
        </div>
        <Card
          name={"Dr. V.S. Kanchana Bhaaskaran"}
          image={kanchana}
          pos={"Vice Chancellor"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card name={"Dr. G.V. Selvam"} image={selvam} pos={"Vice Chancellor"} />
        <Card
          name={"Dr. Sekar Viswanathan"}
          image={sekar}
          pos={"Vice President"}
        />
        <Card
          name={"Dr. Sankar Viswanathan"}
          image={sankar}
          pos={"Vice President"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card
          name={"Dr. Jayabarathi T"}
          image={barathi}
          pos={"Registrar"}
        />
        <Card
          name={"Dr. Partha Sharathi Mallick"}
          image={partha}
          pos={"Pro Vice Chancellor"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card
          name={"Dr. Naiju C.D."}
          image={naiju}
          pos={"Director of Student Welfare"}
        />
        <Card
          name={"Dr. Ramesh Kumar C"}
          image={ramesh}
          pos={"Director, IST"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card
          name={"Dr. PRADHEEP T	"}
          image={pradheep}
          pos={"Faculty Coordinator, E-Cell VIT"}
        />
      </div>
    </section>
  );
};

export default Page;