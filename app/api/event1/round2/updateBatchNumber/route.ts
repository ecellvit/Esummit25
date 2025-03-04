import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Users } from "@/models/user.model";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";

export async function GET(request: Request): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!sessionUser) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: user.email }).exec();
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    if (team.batch >= 3) {
      return NextResponse.json({ message: "Batch Number can't be more than 3" }, { status: 400 });
    }

    team.batch += 1;
    await team.save();

    return NextResponse.json({ message: "Batch incremented successfully", batch: team.batch }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
