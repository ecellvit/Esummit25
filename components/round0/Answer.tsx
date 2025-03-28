"use client";
import React, { useEffect } from "react";
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
  chronoNumber: number;
  setChronoNumber: (value: number) => void;
  setQuestionNumber: (value: number) => void;
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
              ${
                isSelected
                  ? "border-red-600 bg-red-800 text-white"
                  : "border-red-800 hover:border-red-500"
              }`}
          >
            {questionData.ans.optionsType === "text" ? (
              <span
                className="text-lg"
                style={{ fontFamily: "'PoppinsRegular', sans-serif" }}
              >
                {value}
              </span>
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

 

  return (
    <div className="text-black">
      <section className="flex flex-col justify-center items-center text-black p-4 select-none">
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
            {renderOptions()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnswerForQualifier;
