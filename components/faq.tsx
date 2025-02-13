"use client";

import { useState } from "react";

const FaqContent = () => {
  const faqs = [
    { id: 1, q: "Who is eligible to participate in the competition?", ans: "Students of all years are eligible to participate in E-Summit'25." },
    { id: 2, q: "Is there any registration fee?", ans: "The event is absolutely free of cost." },
    { id: 3, q: "What is the duration of the event?", ans: "4 days." },
    { id: 4, q: "How many team event?", ans: "one team event." },
    { id: 5, q: "Will OD be provided?", ans: "Yes, if you register and attend the event you will get OD" },
    { id: 6, q: "Can I participate individually?", ans: "Registrations can be made individually, but participants are required to join a team to be a part of the event." },
    { 
      id: 7, 
      q: "I still have some doubts regarding the event. How can I get them resolved?", 
      ans: (
        <>
          For any further queries, you can contact the following POCs:
          <br />
          <strong>1.XYZ :</strong> +91
          <br />
          <strong>2.ABC:</strong> +91
        </>
      ) 
    },
  ];

  const [visibleFaqs, setVisibleFaqs] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const toggleDropdown = (id: number) => {
    setVisibleFaqs((prevVisibleFaqs) => ({
      ...prevVisibleFaqs,
      [id]: !prevVisibleFaqs[id],
    }));
  };

  return (
    
    <main className="mt-0 md:px-20 p-10 pt-0">
        <h1 className="w-10 h-10 text-5xl gap-5">FAQ'S</h1>
        <br></br>
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-20 justify-around">
        {[faqs.slice(0, 4), faqs.slice(4)].map((faqGroup, index) => (
          <div key={index} className="flex flex-col gap-5 lg:w-[45vw]">
            {faqGroup.map((faq) => (
              <div key={faq.id} className="flex items-start gap-5">
                
                <button 
                  onClick={() => toggleDropdown(faq.id)} 
                  className="w-6 h-6 bg-black text-white rounded-full flex justify-center items-center"
                  aria-expanded={visibleFaqs[faq.id] ? "true" : "false"} 
                  aria-label="Toggle FAQ"
                >
                  {visibleFaqs[faq.id] ? "-" : "+"}
                </button>
                
                <div className="flex flex-col gap-5">
                  <p
                    className={`text-xl md:text-2xl w-[fit-content] relative after:transition-all after:duration-300 after:ease-in-out after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-[#000000] ${visibleFaqs[faq.id] ? 'after:w-full' : 'after:w-0'}`}
                    style={{ fontFamily: "Classic Sans" }}
                  >
                    {faq.q}
                  </p>
                  <p
                    className={`transition-transform duration-300 ease-in-out transform text-l md:text-xl ${visibleFaqs[faq.id] ? 'translate-y-0 opacity-100 max-h-full' : 'translate-y-[-20px] opacity-0 max-h-0'} overflow-hidden`}
                    style={{ fontFamily: "Classic Sans" }}
                  >
                    {faq.ans}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default FaqContent;
