import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FaqContent = () => {
  const faqs = [
    { id: 1, q: "Is individual participation allowed in Innoventure?", ans: "Yes, individual participation is allowed, if you do not have a team you will be allotted one." },
    { id: 2, q: "Is registration mandatory to attend the events?", ans: "Yes, you will have to register for all the events individually." },
    { id: 3, q: "Is there a registration fee to participate?", ans: "No, the event is free of cost." },
    { id: 4, q: "Is there a cap on the number of participants for E-Talk?", ans: "There will be a limit of 1500 students for E-Talk, so grab your seats quickly." },
    { id: 5, q: "What is the duration of the event?", ans: "There are a total of 5 events in a span of 4 days. Each event will have different durations." },
    { id: 6, q: "Will OD’s be provided for the events?", ans: "Yes OD’s will be provided for the duration of the particular event." },
    { id: 7 , q: "Are there any cash prizes for Innoventure winners?", ans:"Yes, Innoventure will have cash prizes. Stay tuned to our Social media to find out."}, 
    {
      id: 8, q: "What is the maximum limit for a team in Innoventure?", ans: "A team can consist of a maximum of 4 participants."
    }, 
    {
      id: 9 , q: "Who is eligible to participate?", ans: "All students are eligible to participate in any of the events."
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
          <strong>2. Hemanth:</strong> +91 8610464790
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

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#faq",
      start: "top bottom",
      onEnter: () => document.body.classList.add("faq-visible"),
      onLeaveBack: () => document.body.classList.remove("faq-visible"),
    });
  }, []);

  return (
    <section
      id="faq"
      className="py-10 px-6 md:px-20 bg-gradient-to-b from-[#6F0F0F] via-[#C72423] via-38% to-[#510D0D] z-10"
    >
      <h2 className="text-4xl md:text-5xl d text-center text-white font-[BrigendsExpanded]">
        FREQUENTLY ASKED QUESTIONS
      </h2>

      <div className="mt-10 flex flex-col lg:flex-row lg:justify-between gap-4">
        {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((faqGroup, index) => (
          <div key={index} className="flex flex-col gap-3 w-full lg:w-[48%]">
            {faqGroup.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white font-bold rounded-lg shadow-md border border-transparent hover:border-black transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center py-3 px-6 text-left text-lg  text-[#14110E] font-[FontSpring]"
                  onClick={() => toggleDropdown(faq.id)}
                >
                  {faq.q}
                  <span className="text-2xl font-[GreaterTheory]">{visibleFaq === faq.id ? "x" : "+"}</span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    visibleFaq === faq.id ? "max-h-40 opacity-100 p-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#6F6C66] text-base font-[FontSpring]">{faq.ans}</p>
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
