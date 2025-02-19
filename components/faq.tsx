import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FaqContent = () => {
  const faqs = [
    { id: 1, q: "Is individual registration allowed in Innoventure?", ans: "Yes, individual registration is allowed. If you do not have a team, you will be provided with one." },
    { id: 2, q: "Is registration mandatory to attend the events?", ans: " Yes, you will have to register for all the events individually." },
    { id: 3, q: "Is there a registration fee to participate?", ans: "No, the event is free of cost." },
    { id: 4, q: "What is the duration of the event?", ans: "There are a total of 5 events in a span of 4 days. Each event will have different durations." },
    { id: 5, q: "Will OD’s be provided for the events?", ans: "Yes OD’s will be provided for the duration of the particular event." },
    { id: 6, q: "Is there a prize pool for Innoventure winners?", ans: "Yes, Innoventure will feature a prize pool. Stay tuned to our Social media to find out." },
    { id: 7 , q: "What is the maximum limit for a team in Innoventure?", ans:"A team can consist of a maximum of 4 participants."}, 
    {
      id: 8, q: "Which events can VIT students be a part of?", ans: " All VIT Vellore students are eligible to participate in Innoventure, E-Talk, Marketing Workshop, and Achievers’ Conclave."
    }, 
    {
      id: 9 , q: "Which events can external students be a part of?", ans: " External participants are eligible to take part in Pioneira, E-Talk, and Achievers’ Conclave."
    },

    { 
      id: 10, 
      q: "How can I resolve further queries?", 
      ans: (
        <>
          Contact any of the following POC’s for further assistance:
          <br />
          <strong>1. Siddhi:</strong> +91 8484996634
          <br />
          <strong>2. Hemanth:</strong> +91 8610364790
          <br />
          <strong>3. Guganesh:</strong> +91 9845227410
        </>
      ) 
    },
  ];

  const [visibleFaq, setVisibleFaq] = useState<number | null>(null);

  const toggleDropdown = (id: number) => {
    setVisibleFaq(visibleFaq === id ? null : id);
  };

  // useEffect(() => {
  //   ScrollTrigger.create({
  //     trigger: "#faq",
  //     start: "top bottom",
  //     onEnter: () => document.body.classList.add("faq-visible"),
  //     onLeaveBack: () => document.body.classList.remove("faq-visible"),
  //   });
  // }, []);

  return (
    <section
      id="faq" 
      className="py-10 px-6 md:px-20 bg-white z-10"
    >
      <h2 className="text-4xl md:text-5xl d text-center text-transparent bg-gradient-to-b from-[#6F0F0F] via-[#C72423] to-[#510D0D] bg-clip-text font-[GreaterTheory]">
        FREQUENTLY ASKED QUESTIONS
      </h2>

      <div className="mt-10 flex flex-col lg:flex-row lg:justify-between gap-2">
        {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((faqGroup, index) => (
          <div key={index} className="flex flex-col gap-3 w-full lg:w-[48%] ">
            {faqGroup.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-[#6F0F0F] font-bold h-15 w-30 rounded-lg shadow-md border border-transparent hover:border-white transition-all duration-3300"
              >
                <button
                  className="w-full flex justify-between items-center py-2 px-6 text-left  text-sm font-[PoppinsRegular] text-white"
                  onClick={() => toggleDropdown(faq.id)}
                >
                  {faq.q}
                  <span className="text-2xl ">{visibleFaq === faq.id ? "x" : "+"}</span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    visibleFaq === faq.id ? "max-h-40 opacity-100 p-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-white text-base font-[PoppinsRegular]">{faq.ans}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqContent;
