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
      <h1 className="uppercase mt-10 mb-5 text-4xl md:text-5xl lg:text-7xl text-center font-bold bg-gradient-to-br  bg-clip-text text-transparent bg-white" 
     style={{
     
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
      >
        <span className="text-white">our</span> patrons
      </h1>
      <div className="flex flex-col items-center pt-6">
    
        <Card
          name={"Dr. G Vishwanathan"}
          image={chancellor}
          pos={"Honorable Chancellor"}
        />
        <Card
          name={"Dr. V.S. Kanchana Bhaaskaran"}
          image={kanchana}
          pos={"Vice Chancellor"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card name={"Dr. G.V. Selvam"} image={selvam} pos={"Vice President"} />
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
          pos={"Pro-Vice Chancellor"}
        />
      </div>
      <div className="flex flex-wrap justify-center pt-6">
        <Card
          name={"Dr. Naiju C.D."}
          image={naiju}
          pos={[
            <span key="director">Director,</span>,
            <br key="break"/>,
            <span key="welfare">Student's Welfare</span>]}
        />
        <Card
          name={"Dr. Ramesh Kumar C"}
          image={ramesh}
          pos={"Director, IST"}
        />
        <Card
        name={"Dr. PRADHEEP T"}
        image={pradheep}
        pos={[
        <span key="faculty">Faculty Coordinator,</span>,
         <br key="break-p" />,
         <span key="ecell">E-Cell VIT</span>,
  ]}
/>


      </div>
     
    </section>
  );
};

export default Page;