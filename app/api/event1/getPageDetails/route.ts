import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "@/lib/authOptions";
import CurrentPageModel from "@/models/event1/currentPage.model";

export async function GET(req: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    if (!sessionUser.events || !sessionUser.events.includes(1)) {
      return NextResponse.json({ success: false, message: "User is not participating in event 1" }, { status: 403 });
    }

    if (sessionUser.event1TeamRole !== 0) {
      return NextResponse.json({ success: false, message: "User is not a team leader" }, { status: 403 });
    }

    const roundDetails = await CurrentPageModel.findOne({ creator: true });
    if (!roundDetails) {
      return NextResponse.json({ success: false, message: "Round details not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Found round details", round: roundDetails.round, page: roundDetails.page, startedAt: roundDetails.startedAt }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user and team data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
