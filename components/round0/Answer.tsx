// "use client";
// import React, { useEffect, useState } from "react";
// import questions from "@/constant/round0/questions.json";

// // Improved typings for better type safety
// interface Question {
//   q: {
//     questionType: "single" | "multiple";
//   };
//   ans: {
//     optionsType: "text" | "image";
//     optionsContent: {
//       [key: string]: string;
//     };
//   };
// }

// interface Props {
//   questionCategory: "easy" | "medium" | "hard" | "";
//   questionNumber: number;
//   chronoNumber: number;
//   setChronoNumber: (value: number) => void;
//   setQuestionNumber: (value: number) => void;
//   setFinalAnswer: (answer: string[]) => void;
//   finalAnswer: string[];
//   selectedOptions: string[];
//   setSelectedOptions: (options: string[]) => void;
// }

// const AnswerForQualifier: React.FC<Props> = ({
//   questionCategory,
//   questionNumber,
//   setFinalAnswer,
//   finalAnswer,
//   selectedOptions,
//   setSelectedOptions,
// }) => {
//   // Reset selections when question changes
//   useEffect(() => {
//     setSelectedOptions([]);
//     setFinalAnswer([]);
//   }, [questionNumber, setSelectedOptions, setFinalAnswer]);

//   // Handle option changes
//   const handleOptionChange = (option: string) => {
//     const questionData =
//       questions[questionCategory as keyof typeof questions]?.[questionNumber];
//     if (!questionData) return;

//     const questionType = questionData.q.questionType;

//     if (questionType === "single") {
//       // Single choice - only one option can be selected
//       setSelectedOptions([option]);
//       setFinalAnswer([option]);
//     } else {
//       // Multiple choice - allow multiple selections
//       const updatedOptions = selectedOptions.includes(option)
//         ? selectedOptions.filter((opt) => opt !== option)
//         : [...selectedOptions, option];

//       setSelectedOptions(updatedOptions);
//       setFinalAnswer(updatedOptions);
//     }
//   };

//   // Render the options dynamically
//   const renderOptions = () => {
//     const questionData =
//       questions[questionCategory as keyof typeof questions]?.[questionNumber];
//     if (!questionData) return null;

//     const questionType = questionData.q.questionType;

//     return Object.entries(questionData.ans.optionsContent).map(
//       ([key, value], index) => {
//         const inputId = `option-${questionNumber}-${key}`;
//         const isSelected = selectedOptions.includes(key);

//         return (
//           <div
//             key={key}
//             className="mb-3 p-2 rounded hover:bg-gray-100 transition-colors"
//           >
//             <label
//               htmlFor={inputId}
//               className="flex items-start cursor-pointer"
//             >
//               {questionType === "single" ? (
//                 <input
//                   id={inputId}
//                   type="radio"
//                   name={`question-${questionNumber}`}
//                   onChange={() => handleOptionChange(key)}
//                   checked={isSelected}
//                   className="mr-2 mt-1"
//                 />
//               ) : (
//                 <input
//                   id={inputId}
//                   type="checkbox"
//                   onChange={() => handleOptionChange(key)}
//                   checked={isSelected}
//                   className="mr-2 mt-1"
//                 />
//               )}

//               {questionData.ans.optionsType === "text" ? (
//                 <span>{value}</span>
//               ) : (
//                 <img
//                   src={value}
//                   className="w-full max-w-[300px] h-auto"
//                   alt={`Answer option ${index + 1}`}
//                 />
//               )}
//             </label>
//           </div>
//         );
//       }
//     );
//   };

//   // Get category color for heading
//   const getCategoryColor = () => {
//     switch (questionCategory) {
//       case "easy":
//         return "text-green-600";
//       case "medium":
//         return "text-yellow-600";
//       case "hard":
//       default:
//         return "text-red-600";
//     }
//   };

//   return (
//     <div className="text-black">
//       <section className="flex flex-col justify-center items-center text-black p-4 select-none">
//         <div className="flex flex-col items-center w-full max-w-4xl">
//           <h2 className={`font-bold mb-4 text-xl ${getCategoryColor()}`}>
//             {questionCategory.charAt(0).toUpperCase() +
//               questionCategory.slice(1)}{" "}
//             Question
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
//             {renderOptions()}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AnswerForQualifier;

"use client";
import React, { useEffect, useState } from "react";
import questions from "@/constant/round0/questions.json";

interface Question {
  q: {
    questionType: "single" | "multiple";
  };
  ans: {
    optionsType: "text" | "image";
    optionsContent: {
      [key: string]: string;
    };
  };
}

interface Props {
  questionCategory: "easy" | "medium" | "hard" | "";
  questionNumber: number;
  setFinalAnswer: (answer: string[]) => void;
  finalAnswer: string[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

const AnswerForQualifier: React.FC<Props> = ({
  questionCategory,
  questionNumber,
  setFinalAnswer,
  selectedOptions,
  setSelectedOptions,
}) => {
  // Reset selections when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setFinalAnswer([]);
  }, [questionNumber, setSelectedOptions, setFinalAnswer]);

  // Handle option selection
  const handleOptionChange = (option: string) => {
    const questionData =
      questions[questionCategory as keyof typeof questions]?.[questionNumber];
    if (!questionData) return;

    const questionType = questionData.q.questionType;

    if (questionType === "single") {
      setSelectedOptions([option]);
      setFinalAnswer([option]);
    } else {
      const updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((opt) => opt !== option)
        : [...selectedOptions, option];

      setSelectedOptions(updatedOptions);
      setFinalAnswer(updatedOptions);
    }
  };

  // Render options as selectable boxes
  const renderOptions = () => {
    const questionData =
      questions[questionCategory as keyof typeof questions]?.[questionNumber];
    if (!questionData) return null;

    return Object.entries(questionData.ans.optionsContent).map(
      ([key, value], index) => {
        const isSelected = selectedOptions.includes(key);

        return (
          <div
            key={key}
            onClick={() => handleOptionChange(key)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center flex items-center justify-center 
              ${isSelected ? "border-red-600 bg-red-100" : "border-red-800 hover:border-red-500"}`}
          >
            {questionData.ans.optionsType === "text" ? (
              <span className="text-lg"
              style={{ fontFamily: "'PoppinsRegular', sans-serif" }}>{value}</span>
            ) : (
              <img
                src={value}
                className="w-full max-w-[300px] h-auto"
                alt={`Answer option ${index + 1}`}
              />
            )}
          </div>
        );
      }
    );
  };

  // Get category color for heading
  const getCategoryColor = () => {
    switch (questionCategory) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="text-black">
      <section className="flex flex-col justify-center items-center text-black p-4 select-none">
        <div className="flex flex-col items-center w-full max-w-4xl">
          <h2 className={`font-bold mb-4 text-xl ${getCategoryColor()}`}>
            {questionCategory.charAt(0).toUpperCase() +
              questionCategory.slice(1)}{" "}
            Question
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
            {renderOptions()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnswerForQualifier;
