import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FaqContent = () => {
  const faqs = [
    { id: 1, q: "Who is eligible to participate in the competition?", ans: "Students of all years are eligible to participate in E-Summit'25." },
    { id: 2, q: "Is there any registration fee?", ans: "The event is absolutely free of cost." },
    { id: 3, q: "What is the duration of the event?", ans: "4 days." },
    { id: 4, q: "How many team events?", ans: "One team event." },
    { id: 5, q: "Will OD be provided?", ans: "Yes, if you register and attend the event, you will get OD." },
    { id: 6, q: "Can I participate individually?", ans: "Registrations can be made individually, but participants are required to join a team to be a part of the event." },
    { 
      id: 7, 
      q: "I still have some doubts regarding the event. How can I get them resolved?", 
      ans: (
        <>
          For any further queries, you can contact the following POCs:
          <br />
          <strong>1. ABC :</strong> +91 XXXXX XXXXX
          <br />
          <strong>2. ABC:</strong> +91 XXXXX XXXXX
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
      className="py-16 px-6 md:px-20 bg-gradient-to-b from-[#6F0F0F] via-[#C72423] via-38% to-[#510D0D] z-10"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white">
        FREQUENTLY ASKED QUESTIONS
      </h2>

      <div className="mt-10 flex flex-col lg:flex-row lg:justify-between gap-6">
        {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((faqGroup, index) => (
          <div key={index} className="flex flex-col gap-4 w-full lg:w-[48%]">
            {faqGroup.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white font-bold rounded-lg shadow-md border border-transparent hover:border-black transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center py-4 px-6 text-left text-lg font-semibold text-[#14110E]"
                  onClick={() => toggleDropdown(faq.id)}
                >
                  {faq.q}
                  <span className="text-2xl">{visibleFaq === faq.id ? "x" : "+"}</span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    visibleFaq === faq.id ? "max-h-40 opacity-100 p-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#6F6C66] text-base">{faq.ans}</p>
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
