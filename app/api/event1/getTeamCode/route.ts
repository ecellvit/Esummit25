import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { Users } from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    // Find the user by userId and populate event1TeamId to get the team information
    const user = await Users.findOne({ email: sessionUser.email });
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
      return NextResponse.json({ message: "User is a member." }, { status: 409 });
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
