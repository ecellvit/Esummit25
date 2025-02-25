import { dbConnect } from "@/lib/dbConnect";
import { Round0 } from "@/models/event1/round0.model";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getTokenDetails } from "@/utils/cn";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const token = await getToken({ req });
    const auth = token
      ? (token.accessTokenFromBackend as string)
      : req.headers.get("Authorization")?.split(" ")[1] || "";
    let userId = await getTokenDetails(auth);

    const teamData = await TeamModel.findOne({ teamLeaderId: userId });
    console.log(userId);
    console.log(teamData);
    if (!teamData) {
      return NextResponse.json({ message: "team not found" }, { status: 404 });
    }

    const round0Data = await Round0.findOne({ teamId: teamData._id });
    console.log('its me', round0Data);
    const questionCatogory = round0Data.questionCategory;
    console.log('ggggggggggggggggggg', questionCatogory);
    const pointer = round0Data?.questionPointer;
    const easyOrder = round0Data?.easyOrder;
    const mediumOrder = round0Data?.mediumOrder;
    const hardOrder = round0Data?.hardOrder;
    console.log('adsfafdsfffffffffffffffff', pointer);
    let questionNumber = 0;

    if (questionCatogory === "waiting") {
      return NextResponse.json({ message: "Round 0 is over", category: "waiting" }, { status: 200 });
    }
    if (questionCatogory === "easy") {
      questionNumber = easyOrder[pointer];
    } else if (questionCatogory === "medium") {
      questionNumber = mediumOrder[pointer];
    } else if (questionCatogory === "hard") {
      questionNumber = hardOrder[pointer];
    } else if (questionCatogory === "instruction") {
      return NextResponse.json({
        category: "instruction",
        questionNumber: -1,
        teamName: round0Data?.teamName,
      }, { status: 200 });
    } else if (questionCatogory === "waiting") {
      return NextResponse.json({
        category: "waiting",
        questionNumber: -1,
        teamName: round0Data?.teamName,
      }, { status: 200 });
    } 

    const response = {
      message: "Successfully got the next question!",
      category: questionCatogory,
      questionNumber: questionNumber,
      chronoNumber: pointer,
      teamName: round0Data?.teamName,
    };

    console.log('adsfsgdfsagasasdsg', response);


    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
