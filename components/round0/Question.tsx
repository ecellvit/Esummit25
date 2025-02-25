'use client'
import React from "react";
import questions from "@/constant/round0/questions.json";
import "@/app/globals.css"

type QuestionForQualifierProps = {
  questionCategory: "easy" | "medium" | "hard" | "caseStudy";
  questionNumber: number;
  chronoNumber: number;
};

export default function QuestionForQualifier(props: QuestionForQualifierProps) {
  return (
    <main>
      <section className="flex flex-col justify-center items-center px-4 pt-10 select-none">
        {props.questionCategory === "easy" && (
          <div
            style={{
              fontFamily: "'GothamBlack', sans-serif",
              background: "black",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            className="flex flex-col text-xl w-fit h-fit p-5 border border-black text-black rounded-lg"
          >
            <div className="text-2xl align-top">Question {props.chronoNumber + 14}</div>
            <div className="select-none">
              {questions[props.questionCategory][props.questionNumber]?.q.content}
            </div>
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "image" &&
              questions[props.questionCategory][props.questionNumber]?.q.contentLink ? (
              <img
                key={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                src={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                alt="question image"
                className="h-auto w-auto"
              />
            ) : (
              <p>No image available for this question</p>
            )}
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "audio" && (
              <div>
                {Array.isArray(
                  questions[props.questionCategory][props.questionNumber]?.q.contentLink
                ) ? (
                  <div>
                    <audio controls className="mb-2">
                      <source
                        src={questions[props.questionCategory][props.questionNumber]?.q.contentLink[0]}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <audio controls className="mb-2">
                      <source
                        src={questions[props.questionCategory][props.questionNumber]?.q.contentLink[1]}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <audio controls className="mb-2">
                    <source
                      src={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}
          </div>
        )}

        {props.questionCategory === "medium" && (
          <div className="flex flex-col text-xl w-fit h-fit p-5 border border-black text-black rounded-lg">
            <div className="text-4xl align-top">Question {props.chronoNumber + 1}</div>
            <div>
              {questions[props.questionCategory][props.questionNumber]?.q.content}
            </div>
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "image" &&
              questions[props.questionCategory][props.questionNumber]?.q.contentLink ? (
              <img
                key={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                src={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                alt="question image"
                className="h-auto w-auto"
              />
            ) : (
              <p>No image available for this question</p>
            )}
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "audio" && (
              <div>
                {Array.isArray(
                  questions[props.questionCategory][props.questionNumber]?.q.contentLink
                ) ? (
                  <div>
                    <audio controls className="mb-2">
                      <source
                        src={questions[props.questionCategory][props.questionNumber]?.q.contentLink[0]}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <audio controls className="mb-2">
                      <source
                        src={questions[props.questionCategory][props.questionNumber]?.q.contentLink[1]}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <audio controls className="mb-2">
                    <source
                      src={questions[props.questionCategory][props.questionNumber]?.q.contentLink}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div>
                  (If you encounter identical audio from previous questions, please refresh the page for the current question.)
                </div>
              </div>
            )}
          </div>
        )}

        {props.questionCategory === "hard" && (
          <div className="flex flex-col text-xl w-fit h-fit p-5 border border-black text-black rounded-lg select-none">
            <div className="text-4xl align-top select-none">
              Question {props.chronoNumber + 19}
            </div>
            <div>
              {questions[props.questionCategory][props.questionNumber]?.q.content}
            </div>
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "image" &&
              questions[props.questionCategory][props.questionNumber]?.q.contentLink && (
                Array.isArray(questions[props.questionCategory][props.questionNumber]?.q.contentLink) ? (
                  (questions[props.questionCategory][props.questionNumber]?.q.contentLink as string[]).map(
                    (link: string, index: number) => (
                      <img
                        key={index}
                        src={link}
                        alt={`question image ${index + 1}`}
                        className="h-auto w-auto"
                      />
                    )
                  )
                ) : (
                  <img
                    src={questions[props.questionCategory][props.questionNumber]?.q.contentLink as string}
                    alt="question image"
                    className="h-auto w-auto"
                  />
                )
              )}
            {questions[props.questionCategory][props.questionNumber]?.q.contentType === "audio" && (
              <div>
                {Array.isArray(
                  questions[props.questionCategory][props.questionNumber]?.q.contentLink
                ) ? (
                  <div>
                    <p>Assertion(A)</p>
                    <audio controls className="mb-2">
                      <source
                        src={
                          questions[props.questionCategory][props.questionNumber]?.q.contentLink[0] as string
                        }
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <p>Reasoning(R)</p>
                    <audio controls className="mb-2">
                      <source
                        src={
                          questions[props.questionCategory][props.questionNumber]?.q.contentLink[1] as string
                        }
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <audio controls className="mb-2">
                    <source
                      src={questions[props.questionCategory][props.questionNumber]?.q.contentLink as string}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div>
                  (If you encounter identical audio from previous questions, please refresh the page for the current question.)
                </div>
              </div>
            )}
          </div>
        )}

        {/* {props.questionCategory === "caseStudy" && (
          <div className="flex flex-col text-xl w-fit h-fit p-5 border border-white text-white rounded-lg">
            <div className="text-4xl align-top">Question {props.chronoNumber + 27}</div>
            <div>
              {questions[props.questionCategory][props.questionNumber].q.content}
            </div>
          </div>
        )} */}
      </section>
    </main>
  );
}
