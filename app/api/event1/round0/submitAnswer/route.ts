import time from "@/constant/round0/time.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model"
import { Users } from "@/models/user.model";
import { getTokenDetails } from "@/utils/cn";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    // Get token from request
    const token = await getToken({ req });
    // Get auth token from either token or Authorization header
    const auth = token
      ? (token.accessTokenFromBackend as string)
      : req.headers.get("Authorization")?.split(" ")[1] || "";
    let userId = await getTokenDetails(auth);
    // Find the team for the user
    const team = await TeamModel.findOne({ teamLeaderId: userId });
    console.log(team);
    // If team not found, return error
    if (!team) {
      // Return error response
    return NextResponse.json({ message: "Team not found" }, { status: 400 });
    }

    // Get team data from Round0 model
    const teamData = await Round0.findOne({ teamId: team._id });
    // Extract answer from request body
    const { answer } = await req.json();
    console.log("answerData", answer);
    const questionPointer = teamData.questionPointer;
    const easyOrder = teamData.easyOrder;
    const mediumOrder = teamData.mediumOrder;
    const hardOrder = teamData.hardOrder;
    const easyAnswers = teamData.easyAnswers;
    const mediumAnswers = teamData.mediumAnswers;
    const hardAnswers = teamData.hardAnswers;
    const caseStudyAnswers = teamData.caseStudyAnswers;
    const endTime = teamData.endTime;
    // Get current question category
    let questionCategory: "easy" | "medium" | "hard" | "caseStudy" | "waiting" = teamData.questionCategory;

    // Check if time is up
    if (endTime < Date.now()) {
      // Update the Round0 model with new values
    await Round0.findOneAndUpdate(
        { teamLeaderId: userId },
        {
          questionCategory: "waiting",
        }
      );
      // Return error response
    return NextResponse.json(
        { message: "Time is up", category: "waiting" },
        { status: 400 }
      );
    }
    let newQuestionPointer = questionPointer;

    // Update answers based on category
    if (questionCategory === "easy") {
      easyAnswers[easyOrder[questionPointer]] = answer;
    } else if (questionCategory == "medium") {
      mediumAnswers[mediumOrder[questionPointer]] = answer;
    } else if (questionCategory == "hard") {
      hardAnswers[hardOrder[questionPointer]] = answer;
    } else if (questionCategory == "caseStudy") {
      caseStudyAnswers[questionPointer] = answer;
    }

    if (questionCategory === "easy" && questionPointer === 4) {
      newQuestionPointer = 0;
      questionCategory = "hard";
    } else if (questionCategory === "medium" && questionPointer === 12) {
      newQuestionPointer = 0;
      questionCategory = "easy";
    } else if (questionCategory === "hard" && questionPointer === 6) {
      newQuestionPointer = 0;
      questionCategory = "waiting";
    } else if (questionCategory === "waiting") {
      // Return error response
    return NextResponse.json(
        { message: "Qualifier round is completed." },
        { status: 400 }
      );
    } else {
      newQuestionPointer = questionPointer + 1;
    }

    await Round0.findOneAndUpdate(
      { teamId: team._id },
      {
        questionPointer: newQuestionPointer,
        questionCategory: questionCategory,
        easyAnswers: easyAnswers,
        mediumAnswers: mediumAnswers,
        hardAnswers: hardAnswers,
        caseStudyAnswers: caseStudyAnswers,
      }
    );
    // Return success response
    // Return error response
    return NextResponse.json({ message: "Answer submitted" }, { status: 200 });
  } catch (err: unknown) {
    console.log(err);
    // Return error response
    return NextResponse.json(
      { message: "Internal server error", error: String(err) },
      { status: 500 }
    );
  }
}
