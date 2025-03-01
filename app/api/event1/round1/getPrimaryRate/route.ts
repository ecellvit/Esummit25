import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import TeamModelRound1 from "@/models/event1/event1Round1Team.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session ||!sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    if (!sessionUser.events || !sessionUser.events.includes(1)) {
      return NextResponse.json({ success: false, message: "User is not participating in event 1" }, { status: 403 });
    }

    if (sessionUser.event1TeamRole !== 0) {
      return NextResponse.json({ success: false, message: "User is not a team leader" }, { status: 403 });
    }

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: sessionUser.email });
    if (!team) {
      return NextResponse.json({ success: false, message: "You are not qualified for this event" }, { status: 403 });
    }

    const primaryRate = team.primaryRate;
    if (!primaryRate) {
      return NextResponse.json({ success: false, message: "No primaryRate found for this team" }, { status: 414 });
    }
    
    return NextResponse.json({ success: true, message: "Portfolio fetched successfully", primaryRate }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } else {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
}