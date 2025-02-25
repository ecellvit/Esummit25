import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connection successful!");

    const session = await getServerSession(authOptions);
    console.log("Session obtained:", session);

    const sessionUser = session?.user;
    if (!session || !sessionUser) {
      console.log("User not authenticated");
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const email = sessionUser.email;
    console.log("User email:", email);

    if (!email) {
      console.log("Invalid request: Email not found");
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const user = await Users.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    console.log("User ID:", userId);

    const teamData = await TeamModel.findOne({ teamLeaderId: userId });
    console.log("Team Data:", teamData);

    if (!teamData) {
      console.log("Team not found for user ID:", userId);
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    const round0Data = await Round0.findOne({ teamId: teamData._id });
    console.log("Round0 Data:", round0Data);

    if (!round0Data) {
      console.log("No Round0 data found for team:", teamData._id);
      return NextResponse.json({ message: "Round0 data not found" }, { status: 404 });
    }

    const questionCatogory = round0Data.questionCategory;
    console.log("Question Category:", questionCatogory);

    const pointer = round0Data.questionPointer;
    console.log("Question Pointer:", pointer);

    const easyOrder = round0Data.easyOrder;
    const mediumOrder = round0Data.mediumOrder;
    const hardOrder = round0Data.hardOrder;

    let questionNumber = 0;

    if (questionCatogory === "waiting") {
      console.log("Round 0 is over for team:", teamData._id);
      return NextResponse.json({ message: "Round 0 is over", category: "waiting" }, { status: 200 });
    }

    if (questionCatogory === "easy") {
      questionNumber = Array.isArray(easyOrder) && pointer < easyOrder.length ? easyOrder[pointer] : -1;
    } else if (questionCatogory === "medium") {
      questionNumber = Array.isArray(mediumOrder) && pointer < mediumOrder.length ? mediumOrder[pointer] : -1;
    } else if (questionCatogory === "hard") {
      questionNumber = Array.isArray(hardOrder) && pointer < hardOrder.length ? hardOrder[pointer] : -1;
    } else if (questionCatogory === "instruction") {
      console.log("Question category is instruction");
      return NextResponse.json({
        category: "instruction",
        questionNumber: -1,
        teamName: round0Data.teamName,
      }, { status: 200 });
    } else if (questionCatogory === "waiting") {
      console.log("Question category is waiting");
      return NextResponse.json({
        category: "waiting",
        questionNumber: -1,
        teamName: round0Data.teamName,
      }, { status: 200 });
    }

    const response = {
      message: "Successfully got the next question!",
      category: questionCatogory,
      questionNumber: questionNumber,
      chronoNumber: pointer,
      teamName: round0Data.teamName,
    };

    console.log("Final Response:", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
