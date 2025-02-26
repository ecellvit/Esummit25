"use client";
import React, { useEffect, useState } from "react";
import questions from "@/constant/round0/questions.json";

// Improved typings for better type safety
interface Question {
  q: {
    questionType: "single" | "multiple";
    // other properties...
  };
  ans: {
    optionsType: "text" | "image";
    optionsContent: {
      [key: string]: string;
    };
  };
}

interface QuestionSet {
  easy: Question[];
  medium: Question[];
  hard: Question[];
  caseStudy: Question[];
}

interface Props {
  questionCategory: "easy" | "medium" | "hard" | "caseStudy";
  questionNumber: number;
  setFinalAnswer: (answer: string[]) => void;
  finalAnswer: string[];
  changeOption: boolean;
}

const AnswerForQualifier: React.FC<Props> = ({
  questionCategory,
  questionNumber,
  setFinalAnswer,
  finalAnswer,
  changeOption,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string[];
  }>({});

  // Reset selections when question changes
  useEffect(() => {
    setSelectedOptions({});
    setFinalAnswer([]);
  }, [questionNumber, changeOption, setFinalAnswer]);

  // Update final answer based on question type
  const updateFinalAnswer = (option: string) => {
    const questionData =
      questions[questionCategory as keyof typeof questions]?.[questionNumber];
    if (!questionData) return;

    const questionType = questionData.q.questionType as "single" | "multiple";

    if (questionType === "single") {
      setFinalAnswer([option]);
    } else {
      // For multiple choice questions - fixing the error here
      const newAnswer = finalAnswer.includes(option)
        ? finalAnswer.filter((item) => item !== option) // Remove if already selected
        : [...finalAnswer, option]; // Add if not selected

      setFinalAnswer(newAnswer);
    }
  };

  const handleOptionChange = (questionId: number, option: string) => {
    const questionData =
      questions[questionCategory as keyof typeof questions]?.[questionId];
    if (!questionData) return;

    const questionType = questionData.q.questionType as "single" | "multiple";
    const isSelected = selectedOptions[questionId]?.includes(option);

    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]:
        questionType === "single"
          ? [option]
          : isSelected
          ? (prevOptions[questionId] || []).filter(
              (selectedOption) => selectedOption !== option
            )
          : [...(prevOptions[questionId] || []), option],
    }));

    // Update the final answer
    updateFinalAnswer(option);
  };

  const renderOptions = () => {
    const questionData =
      questions[questionCategory as keyof typeof questions]?.[questionNumber];
    if (!questionData) return null;

    const questionType = questionData.q.questionType as "single" | "multiple";

    return Object.entries(questionData.ans.optionsContent).map(
      ([key, value], index) => {
        const inputId = `option-${questionNumber}-${key}`;
        const isSelected =
          selectedOptions[questionNumber]?.includes(key) || false;

        return (
          <div
            key={key}
            className="mb-3 p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <label
              htmlFor={inputId}
              className="flex items-start cursor-pointer"
            >
              {questionType === "single" ? (
                <input
                  id={inputId}
                  type="radio"
                  name={`question-${questionNumber}`}
                  onChange={() => {
                    handleOptionChange(questionNumber, key);
                  }}
                  checked={isSelected}
                  className="mr-2 mt-1"
                />
              ) : (
                <input
                  id={inputId}
                  type="checkbox"
                  onChange={() => {
                    handleOptionChange(questionNumber, key);
                  }}
                  checked={isSelected}
                  className="mr-2 mt-1"
                />
              )}

              {questionData.ans.optionsType === "text" ? (
                <span>{value}</span>
              ) : (
                <img
                  src={value}
                  className="w-full max-w-[300px] h-auto"
                  alt={`Answer option ${index + 1}`}
                />
              )}
            </label>
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
      case "caseStudy":
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
