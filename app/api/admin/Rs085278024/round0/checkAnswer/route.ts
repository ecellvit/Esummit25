import answers from "@/constant/round0/answers.json";
import gamePoints from "@/constant/round0/points.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0, IRound0 } from "@/models/event1/round0.model";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

interface AnswerData {
  easyAnswers: (number | number[])[];
  mediumAnswers: (number | number[])[];
  hardAnswers: (number | number[])[];
  caseStudyAnswers?: (number | number[])[];
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const qualTeams: IRound0[] = await Round0.find();
    if (!qualTeams || qualTeams.length === 0) {
      return NextResponse.json({ message: "Team not found" }, { status: 400 });
    }

    console.log("3456765434567898765434567897654345678");
    console.log("qualTeamsLength=", qualTeams.length);
    let counter = 0;
    qualTeams.forEach(async (qualTeam) => {
      counter++;

      let points = 0;
      const qualifierData: IRound0 | null = await Round0.findOne({
        teamName: qualTeam.teamName,
      });
      if (!qualifierData) return;

      const { easyAnswers, mediumAnswers, hardAnswers } = qualifierData;

      // for comparing easy answers
      for (let pointer = 0; pointer < easyAnswers.length; pointer++) {
        const userAnswer = easyAnswers[pointer];
        const correctAnswer = answers.easyAnswers[pointer];
      
        // Check if both are arrays of numbers
        if (
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.every(item => typeof item === "number") &&
          correctAnswer.every(item => typeof item === "number") &&
          compareArrays(
            userAnswer as number[],
            correctAnswer as number[]
          )
        ) {
          points += gamePoints.easyPoints;
        }
      }
      
      

      // for comparing medium answers
      for (let pointer = 0; pointer < mediumAnswers.length; pointer++) {
        const userAnswer = mediumAnswers[pointer];
        const correctAnswer = answers.mediumAnswers[pointer];
      
        // Check if both are arrays of numbers
        if (
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.every(item => typeof item === "number") &&
          correctAnswer.every(item => typeof item === "number") &&
          compareArrays(
            userAnswer as number[],
            correctAnswer as number[]
          )
        ) {
          points += gamePoints.easyPoints;
        }
      }
      

      // for comparing hard answers
      for (let pointer = 0; pointer < hardAnswers.length; pointer++) {
        const userAnswer = hardAnswers[pointer];
        const correctAnswer = answers.hardAnswers[pointer];
      
        // Check if both are arrays of numbers
        if (
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.every(item => typeof item === "number") &&
          correctAnswer.every(item => typeof item === "number") &&
          compareArrays(
            userAnswer as number[],
            correctAnswer as number[]
          )
        ) {
          points += gamePoints.easyPoints;
        }
      }
      

      await Round0.findOneAndUpdate(
        { teamName: qualTeam.teamName },
        { points: points }
      );
    });
    console.log("Counter ==== ", counter);
    return NextResponse.json(
      { message: "Points updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

function compareArrays(arr1: number[], arr2: number[]): boolean {
  if (!arr1 || !arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Convert arrays to sets
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Check if sets are equal
  return arraysAreEqual(Array.from(set1), Array.from(set2));
}

function arraysAreEqual(array1: number[], array2: number[]): boolean {
  return array1.every((element) => array2.includes(parseInt(element.toString())));
}
