// "use client";
// import  Instructions  from "@/components/round0/instructions";


// const InstructionsPage= () => {
//   return (
//     <Instructions/>
//   );
// };

// export default InstructionsPage;
"use client";
import bgWebsite from "@/assets/bgRound0.png";
import Instructions from "@/components/round0/instructions";

const InstructionsPage = () => {
  return (
    <main
    className="min-h-screen pt-[5rem] p-6"
    style={{
      backgroundImage: `url(${bgWebsite.src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
     <Instructions />;
  </main>
 
  )
};

export default InstructionsPage;