"use client";
import React, { useEffect, useState } from "react";
import questions from "@/constant/round0/questions.json";

interface Props {
  questionCategory: "easy" | "medium" | "hard" ;
  questionNumber: number;
  setFinalAnswer: (answer: string[]) => void;
  finalAnswer: string[];
  changeOption: boolean;
}

interface Questions {
  [key: string]: {
    [key: number]: {
      q: {
        questionType: "single" | "multiple";
      };
      ans: {
        optionsType: "text" | "image";
        optionsContent: {
          [key: string]: string;
        };
      };
    };
  };
}

const AnswerForQualifier: React.FC<Props> = (props) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string[];
  }>({});

  useEffect(() => {
    setSelectedOptions({});
  }, [props.questionNumber]);

  useEffect(() => {
    setSelectedOptions({});
  }, [props.changeOption]);

  const storeAnswer = (ele: string) => {
    props.setFinalAnswer([ele]);
  };

  const handleOptionChange = (questionId: number, option: string) => {
    const isSelected = selectedOptions[questionId]?.includes(option);

    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: getUpdatedOptions(
        prevOptions[questionId] || [],
        option,
        questions[props.questionCategory]?.[questionId]?.q.questionType as "single" | "multiple",
        isSelected
      ),
    }));
  };

  const getUpdatedOptions = (
    prevOptions: string[],
    option: string,
    optionType: "single" | "multiple",
    isSelected: boolean
  ) => {
    if (optionType === "single") {
      return [option];
    } else {
      return isSelected
        ? prevOptions.filter((selectedOption) => selectedOption !== option)
        : [...prevOptions, option];
    }
  };

  return (
    <main className="text-black">
      <section className="flex flex-col justify-center items-center text-black p-4 select-none">
        {props.questionCategory === "easy" && (
          <div className="flex flex-col items-center text-xl">
            <h2 className="font-bold mb-4 text-green-600">Easy Question</h2>
            <ul className="grid grid-cols-2 gap-8">
              {questions["easy"] &&
                questions["easy"][props.questionNumber] &&
                questions["easy"][props.questionNumber]?.ans.optionsContent &&
                Object.keys(
                  questions["easy"][props.questionNumber]?.ans.optionsContent
                ).map((ele) => {
                  return (
                    <div
                      key={ele}
                      onClick={() => {
                        handleOptionChange(props.questionNumber, ele);
                        storeAnswer(ele);
                      }}
                    >
                      {questions["easy"][props.questionNumber]?.ans
                        .optionsType === "text" ? (
                        <div key={ele}>
                          <label>
                            <input
                              type="radio"
                              onChange={() => {
                                handleOptionChange(props.questionNumber, ele);
                                storeAnswer(ele);
                              }}
                              checked={
                                selectedOptions[props.questionNumber]?.includes(
                                  ele
                                ) || false
                              }
                              className="mr-2 select-none"
                            />
                            {
                              questions["easy"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                          </label>
                        </div>
                      ) : (
                        <div className="flex" key={ele}>
                          <input
                            type="radio"
                            onChange={() => {
                              handleOptionChange(props.questionNumber, ele);
                              storeAnswer(ele);
                            }}
                            checked={
                              selectedOptions[props.questionNumber]?.includes(
                                ele
                              ) || false
                            }
                            className="mr-2"
                          />
                          <img
                            src={
                              questions["easy"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                            className="w-[300px] h-auto"
                            alt="answer image"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </ul>
          </div>
        )}
        {props.questionCategory === "medium" && (
          <div className="flex flex-col items-center text-xl">
            <h2 className="font-bold mb-4 text-yellow-600">Medium Question</h2>
            <ul className="grid grid-cols-2 gap-8">
              {questions["medium"] &&
                questions["medium"][props.questionNumber] &&
                questions["medium"][props.questionNumber]?.ans.optionsContent &&
                Object.keys(
                  questions["medium"][props.questionNumber]?.ans.optionsContent
                ).map((ele) => {
                  return (
                    <div
                      key={ele}
                      onClick={() => {
                        handleOptionChange(props.questionNumber, ele);
                        storeAnswer(ele);
                      }}
                    >
                      {questions["medium"][props.questionNumber]?.ans
                        .optionsType === "text" ? (
                        <div key={ele}>
                          <label>
                            <input
                              type="radio"
                              onChange={() => {
                                handleOptionChange(props.questionNumber, ele);
                                storeAnswer(ele);
                              }}
                              checked={
                                selectedOptions[props.questionNumber]?.includes(
                                  ele
                                ) || false
                              }
                              className="mr-2 select-none"
                            />
                            {
                              questions["medium"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                          </label>
                        </div>
                      ) : (
                        <div className="flex" key={ele}>
                          <input
                            type="radio"
                            onChange={() => {
                              handleOptionChange(props.questionNumber, ele);
                              storeAnswer(ele);
                            }}
                            checked={
                              selectedOptions[props.questionNumber]?.includes(
                                ele
                              ) || false
                            }
                            className="mr-2"
                          />
                          <img
                            src={
                              questions["medium"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                            className="w-[300px] h-auto"
                            alt="answer image"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </ul>
          </div>
        )}
        {props.questionCategory === "hard" && (
          <div className="flex flex-col items-center text-xl">
            <h2 className="font-bold mb-4 text-yellow-600">Medium Question</h2>
            <ul className="grid grid-cols-2 gap-8">
              {questions["hard"] &&
                questions["hard"][props.questionNumber] &&
                questions["hard"][props.questionNumber]?.ans.optionsContent &&
                Object.keys(
                  questions["hard"][props.questionNumber]?.ans.optionsContent
                ).map((ele) => {
                  return (
                    <div
                      key={ele}
                      onClick={() => {
                        handleOptionChange(props.questionNumber, ele);
                        storeAnswer(ele);
                      }}
                    >
                      {questions["hard"][props.questionNumber]?.ans
                        .optionsType === "text" ? (
                        <div key={ele}>
                          <label>
                            <input
                              type="radio"
                              onChange={() => {
                                handleOptionChange(props.questionNumber, ele);
                                storeAnswer(ele);
                              }}
                              checked={
                                selectedOptions[props.questionNumber]?.includes(
                                  ele
                                ) || false
                              }
                              className="mr-2 select-none"
                            />
                            {
                              questions["hard"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                          </label>
                        </div>
                      ) : (
                        <div className="flex" key={ele}>
                          <input
                            type="radio"
                            onChange={() => {
                              handleOptionChange(props.questionNumber, ele);
                              storeAnswer(ele);
                            }}
                            checked={
                              selectedOptions[props.questionNumber]?.includes(
                                ele
                              ) || false
                            }
                            className="mr-2"
                          />
                          <img
                            src={
                              questions["hard"][props.questionNumber]?.ans
                                .optionsContent[ele]
                            }
                            className="w-[300px] h-auto"
                            alt="answer image"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};

export default AnswerForQualifier;
