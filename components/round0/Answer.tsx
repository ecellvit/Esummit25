"use client";
import React, { useEffect, useState } from "react";
import questions from "@/constant/round0/questions.json";

interface Props {
  questionCategory: "easy" | "medium" | "hard";
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

  useEffect(() => {
    setSelectedOptions({});
  }, [questionNumber, changeOption]);

  const storeAnswer = (ele: string) => {
    setFinalAnswer([ele]);
  };

  const handleOptionChange = (questionId: number, option: string) => {
    const isSelected = selectedOptions[questionId]?.includes(option);
    const questionType = questions[questionCategory]?.[questionId]?.q
      .questionType as "single" | "multiple";

    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]:
        questionType === "single"
          ? [option]
          : isSelected
          ? prevOptions[questionId].filter(
              (selectedOption) => selectedOption !== option
            )
          : [...(prevOptions[questionId] || []), option],
    }));
  };

  const renderOptions = () => {
    const questionData = questions[questionCategory]?.[questionNumber];
    if (!questionData) return null;

    return Object.entries(questionData.ans.optionsContent).map(
      ([key, value]) => (
        <div
          key={key}
          onClick={() => {
            handleOptionChange(questionNumber, key);
            storeAnswer(key);
          }}
        >
          {questionData.ans.optionsType === "text" ? (
            <label>
              <input
                type="radio"
                onChange={() => {
                  handleOptionChange(questionNumber, key);
                  storeAnswer(key);
                }}
                checked={
                  selectedOptions[questionNumber]?.includes(key) || false
                }
                className="mr-2 select-none"
              />
              {value}
            </label>
          ) : (
            <div className="flex">
              <input
                type="radio"
                onChange={() => {
                  handleOptionChange(questionNumber, key);
                  storeAnswer(key);
                }}
                checked={
                  selectedOptions[questionNumber]?.includes(key) || false
                }
                className="mr-2"
              />
              <img
                src={value}
                className="w-[300px] h-auto"
                alt="answer option"
              />
            </div>
          )}
        </div>
      )
    );
  };

  return (
    <main className="text-black">
      <section className="flex flex-col justify-center items-center text-black p-4 select-none">
        <div className="flex flex-col items-center text-xl">
          <h2
            className={`font-bold mb-4 ${
              questionCategory === "easy"
                ? "text-green-600"
                : questionCategory === "medium"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {questionCategory.charAt(0).toUpperCase() +
              questionCategory.slice(1)}{" "}
            Question
          </h2>
          <ul className="grid grid-cols-2 gap-8">{renderOptions()}</ul>
        </div>
      </section>
    </main>
  );
};

export default AnswerForQualifier;
