// import answers from "@/constant/round0/answers.json";
// import gamePoints from "@/constant/round0/points.json";
// import { dbConnect } from "@/lib/dbConnect";
// import { Round0, IRound0 } from "@/models/event1/round0.model";
// import { NextResponse } from "next/server";

// interface AnswerData {
//   easyAnswers: (number|number[])[];
//   mediumAnswers: (number | number[])[];
//   hardAnswers: (number | number[])[];
// }

// export async function GET(req: Request) {
//   console.log('cvbnmkjhgfddertyuio');
//   await dbConnect();
//   try {

//     const qualTeams: IRound0[] = await Round0.find();
//     if (!qualTeams || qualTeams.length === 0) {
//       return NextResponse.json({ message: "Team not found" }, { status: 400 });
//     }

//     console.log("3456765434567898765434567897654345678");
//     console.log("qualTeamsLength=", qualTeams.length);
//     let counter = 0;
//     console.log('qualTeams=', qualTeams);
//     qualTeams.forEach(async (qualTeam) => {
//       counter++;

//       let points = 0;
//       const qualifierData: IRound0 | null = await Round0.findOne({
//         teamName: qualTeam.teamName,
//       });
//       if (!qualifierData) return;
//       console.log("qualifierData=", qualifierData);
//       const easyAnswers = qualifierData.easyAnswers;
//       const mediumAnswers = qualifierData.mediumAnswers;
//       const hardAnswers = qualifierData.hardAnswers;
//       // const { easyAnswers, mediumAnswers, hardAnswers } = qualifierData;
//       // console.log("easyAnswers=", easyAnswers);
//       // console.log("mediumAnswers=", mediumAnswers);
//       // console.log("hardAnswers=", hardAnswers);


//       // for comparing easy answers
//       for (let pointer = 0; pointer < easyAnswers.length; pointer++) {
//         const userAnswer = easyAnswers[pointer];
//         const correctAnswer = answers.easyAnswers[pointer];
      
//         // Check if both are arrays of numbers
//         if (
//           Array.isArray(userAnswer) &&
//           Array.isArray(correctAnswer) &&
//           userAnswer.every(item => typeof item === "number") &&
//           correctAnswer.every(item => typeof item === "number") &&
//           compareArrays(
//             userAnswer as number[],
//             correctAnswer as number[]
//           )
//         ) {
//           points += gamePoints.easyPoints;
//         }
//       }
      
      

//       // for comparing medium answers
//       for (let pointer = 0; pointer < mediumAnswers.length; pointer++) {
//         const userAnswer = mediumAnswers[pointer];
//         const correctAnswer = answers.mediumAnswers[pointer];
      
//         // Check if both are arrays of numbers
//         if (
//           Array.isArray(userAnswer) &&
//           Array.isArray(correctAnswer) &&
//           userAnswer.every(item => typeof item === "number") &&
//           correctAnswer.every(item => typeof item === "number") &&
//           compareArrays(
//             userAnswer as number[],
//             correctAnswer as number[]
//           )
//         ) {
//           points += gamePoints.mediumPoints;
//         }
//       }
      

//       // for comparing hard answers
//       for (let pointer = 0; pointer < hardAnswers.length; pointer++) {
//         const userAnswer = hardAnswers[pointer];
//         const correctAnswer = answers.hardAnswers[pointer];
      
//         // Check if both are arrays of numbers
//         if (
//           Array.isArray(userAnswer) &&
//           Array.isArray(correctAnswer) &&
//           userAnswer.every(item => typeof item === "number") &&
//           correctAnswer.every(item => typeof item === "number") &&
//           compareArrays(
//             userAnswer as number[],
//             correctAnswer as number[]
//           )
//         ) {
//           points += gamePoints.hardPoints;
//         }
//       }
//       console.log("points=", points);

//       await Round0.findOneAndUpdate(
//         { teamName: qualTeam.teamName },
//         { points: points }
//       );
//     });
//     console.log("Counter ==== ", counter);
//     return NextResponse.json(
//       { message: "Points updated successfully" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// function compareArrays(arr1: number[], arr2: number[]): boolean {
//   if (!arr1 || !arr2) {
//     return false;
//   }
//   if (arr1.length !== arr2.length) {
//     return false;
//   }

//   // Convert arrays to sets
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);

//   // Check if sets are equal
//   return arraysAreEqual(Array.from(set1), Array.from(set2));
// }

// function arraysAreEqual(array1: number[], array2: number[]): boolean {
//   return array1.every((element) => array2.includes(parseInt(element.toString())));
// }

// import { NextApiRequest, NextApiResponse } from "next";
// import answers from "@/constant/round0/answers.json";
// import gamePoints from "@/constant/round0/points.json";
// import { dbConnect } from "@/lib/dbConnect";
// import { Round0, IRound0 } from "@/models/event1/round0.model";
// import { NextResponse } from "next/server";
// import { console } from "inspector";

// export async function GET(
//   req: NextApiRequest
// ) {
  
//   await dbConnect();
//   try {

//     const qualTeams = await Round0.find();
//     if (!qualTeams || qualTeams.length === 0) {
//       return NextResponse.json({ message: "No teams found" },{status: 400});
//     }

//     console.log("Total teams:", qualTeams.length);
//     let counter = 0;

//     for (const qualTeam of qualTeams) {
//       counter++;
//       let points = 0;

//       const qualifierData = await Round0.findOne({
//         teamName: qualTeam.teamName,
//       });
//       if (!qualifierData) continue;
//       console.log("Qualifier data:", qualifierData);
//       const {
//         easyAnswers = [],
//         mediumAnswers = [],
//         hardAnswers = [],
//       } = qualifierData;

//       console.log("Easy answers:", easyAnswers);
//       console.log("Medium answers:", mediumAnswers);
//       console.log("Hard answers:", hardAnswers);

//       console.log(`Processing team: ${qualTeam.teamName}`);

//       points += calculatePoints(
//         easyAnswers,
//         answers.easyAnswers,
//         gamePoints.easyPoints
//       );
//       points += calculatePoints(
//         mediumAnswers,
//         answers.mediumAnswers,
//         gamePoints.mediumPoints
//       );
//       points += calculatePoints(
//         hardAnswers,
//         answers.hardAnswers,
//         gamePoints.hardPoints
//       );

//       const updateResult = await Round0.findOneAndUpdate(
//         { teamName: qualTeam.teamName },
//         { points },
//         { new: true }
//       );
//       console.log("Updated team:", updateResult);
//     }

//     console.log("Total teams processed:", counter);
//     return NextResponse.json({ message: "Points updated successfully" },{status: 200});
//   } catch (err) {
//     console.error("Error updating points:", err);
//     return NextResponse.json({ error: "Internal server error" },{status: 500});
//   }
// }

// function calculatePoints(
//   userAnswers: any[],
//   correctAnswers: any[],
//   pointValue: number
// ): number {
//   let totalPoints = 0;
//   for (let pointer = 0; pointer < userAnswers.length; pointer++) {
//     if (
//       Array.isArray(correctAnswers[pointer]) &&
//       compareArrays(userAnswers[pointer], correctAnswers[pointer])
//     ) {
//       totalPoints += pointValue;
//     }
//   }
//   return totalPoints;
// }

// function compareArrays(arr1: any[], arr2: any[]): boolean {
//   if (!arr1 || !arr2 || arr1.length !== arr2.length) {
//     return false;
//   }

//   const set1 = new Set(arr1.map(String));
//   const set2 = new Set(arr2.map(String));

//   return arraysAreEqual([...set1], [...set2]);
// }

// function arraysAreEqual(array1: string[], array2: string[]): boolean {
//   return (
//     array1.every((element) => array2.includes(element)) &&
//     array2.every((element) => array1.includes(element))
//   );
// }

import answers from "@/constant/round0/answers.json";
import gamePoints from "@/constant/round0/points.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0, IRound0 } from "@/models/event1/round0.model";
import { NextRequest,NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
) {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully.");

    const qualTeams = await Round0.find();
    if (!qualTeams || qualTeams.length === 0) {
      console.warn("No teams found in the database.");
      return NextResponse.json({ message: "No teams found" },{status: 400});
    }

    console.log("Total teams found:", qualTeams.length);
    let counter = 0;

    for (const qualTeam of qualTeams) {
      console.log(`Processing team: ${qualTeam.teamName}`);
      counter++;
      let points = 0;

      const qualifierData = await Round0.findOne({
        teamName: qualTeam.teamName,
      });
      if (!qualifierData) {
        console.warn(`No data found for team: ${qualTeam.teamName}`);
        continue;
      }

      const {
        easyAnswers = [],
        mediumAnswers = [],
        hardAnswers = [],
      } = qualifierData;

      console.log("Team Answers:", {
        easyAnswers,
        mediumAnswers,
        hardAnswers,
      });

      points += calculatePoints(
        easyAnswers,
        answers.easyAnswers,
        gamePoints.easyPoints
      );
      points += calculatePoints(
        mediumAnswers,
        answers.mediumAnswers,
        gamePoints.mediumPoints
      );
      points += calculatePoints(
        hardAnswers,
        answers.hardAnswers,
        gamePoints.hardPoints
      );

      console.log(`Total points for ${qualTeam.teamName}:`, points);

      const updateResult = await Round0.findOneAndUpdate(
        { teamName: qualTeam.teamName },
        { points },
        { new: true }
      );
      console.log("Updated team data:", updateResult);
    }

    console.log("Total teams processed successfully:", counter);
    return NextResponse.json({ message: "Points updated successfully" },{status: 200});
  } catch (err) {
    console.error("Error updating points:", err);
    return NextResponse.json({ error: "Internal server error" },{status: 500});
  }
}

function calculatePoints(
  userAnswers: any[],
  correctAnswers: any[],
  pointValue: number
): number {
  let totalPoints = 0;
  for (let pointer = 0; pointer < userAnswers.length; pointer++) {
    if (
      Array.isArray(correctAnswers[pointer]) &&
      compareArrays(userAnswers[pointer], correctAnswers[pointer])
    ) {
      totalPoints += pointValue;
    }
  }
  return totalPoints;
}

function compareArrays(arr1: any[], arr2: any[]): boolean {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return false;
  }

  const set1 = new Set(arr1.map(String));
  const set2 = new Set(arr2.map(String));

  return arraysAreEqual([...set1], [...set2]);
}

function arraysAreEqual(array1: string[], array2: string[]): boolean {
  return (
    array1.every((element) => array2.includes(element)) &&
    array2.every((element) => array1.includes(element))
  );
}
