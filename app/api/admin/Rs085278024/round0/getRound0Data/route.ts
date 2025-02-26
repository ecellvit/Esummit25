import { dbConnect } from "@/lib/dbConnect";
import { Round0, IRound0 } from "@/models/event1/round0.model";
import  TeamModel,{ Team } from "@/models/event1/Team.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const teams: Team[] = await TeamModel.find();

    for (const team of teams) {
      const teamId = team._id;
      const teamName = team.teamName;
      const leaderName = team.teamLeaderName;
      const leaderEmail = team.teamLeaderEmail;

      const newLevel1 = new Round0({
        teamName: teamName,
        teamId: teamId,
        leaderName: leaderName,
        leaderEmail: leaderEmail,
        questionCategory: "instruction",
      });

      await newLevel1.save();
    }
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
