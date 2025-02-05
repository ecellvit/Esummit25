import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { Users } from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // Find the user by userId and populate event1TeamId to get the team information
    const user = await Users.findById(userId).populate("event1TeamId");
    if (!user || !user.event1TeamId) {
      return NextResponse.json(
        { message: "User has no team." },
        { status: 404 }
      );
    }

    // Check if the user is a leader or a member
    const userRole = user.event1TeamRole;
    if (userRole === 1) {
      // User is a member
      return NextResponse.json({ message: "User is a member." });
    }

    // If the user is a leader, return the team details
    const team = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    return NextResponse.json({ teamCode: team.teamCode }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user and team data:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
