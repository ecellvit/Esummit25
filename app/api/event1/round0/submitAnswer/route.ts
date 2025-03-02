import time from "@/constant/round0/time.json";
import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Interface for request body
interface RequestBody {
  answer: string;
}

// Interface for Team Data
interface TeamData {
  questionPointer: number;
  easyOrder: number[];
  mediumOrder: number[];
  hardOrder: number[];
  easyAnswers: Record<number, string>;
  mediumAnswers: Record<number, string>;
  hardAnswers: Record<number, string>;
  caseStudyAnswers: Record<number, string>;
  endTime: number;
  questionCategory: "easy" | "medium" | "hard" | "caseStudy" | "waiting";
  _id: string;
}

// Interface for Round0 Data
interface Round0Data {
  teamId: string;
  questionPointer: number;
  questionCategory: string;
  easyAnswers: Record<number, string>;
  mediumAnswers: Record<number, string>;
  hardAnswers: Record<number, string>;
  caseStudyAnswers: Record<number, string>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('conneting')
  await dbConnect();
  console.log('hee;;')
  try {
    const session = await getServerSession(authOptions);

    const sessionUser = session?.user;
    if (!session || !sessionUser) {
      console.log("User not authenticated");
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const email = sessionUser.email;

    if (!email) {
      console.log("Invalid request: Email not found");
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const user = await Users.findOne({ email: email });

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    const teamData: TeamData | null = await TeamModel.findOne({ teamLeaderId: userId });


    if (!teamData) {
      console.log("Team not found for user ID:", userId);
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Extract answer from request body
    const { answer }: RequestBody = await req.json();

    const check = await Round0.findOne({ teamId: teamData._id });
    console.log("check:", check);
    

    let easyAnswers = check?.easyAnswers;
    let mediumAnswers = check?.mediumAnswers;
    let hardAnswers = check?.hardAnswers;
    let easyOrder = check?.easyOrder;
    let mediumOrder = check?.mediumOrder;
    let hardOrder = check?.hardOrder;
    let endTime = check?.endTime;

    let questionCategory = check?.questionCategory;
    console.log('endTime', endTime);
    // Check if time is up
    if (endTime && new Date(endTime).getTime() < Date.now()) {
      // Update the Round0 model with new values
      await Round0.findOneAndUpdate(
        { teamLeaderId: userId },
        { questionCategory: "waiting" }
      );
      console.log("Time is up for team:", teamData._id);
      // Return error response
      return NextResponse.json(
        { message: "Time is up", category: "waiting" },
        { status: 400 }
      );
    }
    let questionPointer = check?.questionPointer;
    let newQuestionPointer = questionPointer;
    console.log('Question Pointer:', questionPointer);

    // Update answers based on category
    if (questionCategory === "easy" && easyAnswers && easyOrder) {
      if (questionPointer !== undefined) {
        easyAnswers[easyOrder[questionPointer]] = answer;
      }
    } else if (questionCategory === "medium" && mediumAnswers && mediumOrder) {
      if (questionPointer !== undefined) {
        mediumAnswers[mediumOrder[questionPointer]] = answer;
      }
    } else if (questionCategory === "hard" && hardAnswers && hardOrder) {
      if (questionPointer !== undefined) {
        hardAnswers[hardOrder[questionPointer]] = answer;
      }
    }

    // Logic for moving to the next question or category
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
      console.log("Qualifier round completed for team:", teamData._id);
      return NextResponse.json(
        { message: "Qualifier round is completed." },
        { status: 400 }
      );
    } else {
      newQuestionPointer = questionPointer !== undefined ? questionPointer + 1 : 0;
    }

    // Update the Round0 model with new values
    await Round0.findOneAndUpdate(
      { teamId: teamData._id },
      {
        questionPointer: newQuestionPointer,
        questionCategory: questionCategory,
        easyAnswers: easyAnswers,
        mediumAnswers: mediumAnswers,
        hardAnswers: hardAnswers,
      }
    );

    console.log("Answer submitted successfully for team:", teamData._id);
    // Return success response
    return NextResponse.json({ message: "Answer submitted" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Internal server error:", err);
    // Return error response
    return NextResponse.json(
      { message: "Internal server error", error: String(err) },
      { status: 500 }
    );
  }
}
