import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; // Adjust the path to your database connection
import { Users } from "@/models/user.model"; // Adjust paths based on your project structure
import TeamModel from "@/models/event1/Team.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect(); // Ensure the database is connected

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const { teamCode } = await req.json();

    // Validate input
    if (!teamCode) {
      return NextResponse.json(
        { message: "Team Code is required." },
        { status: 400 }
      );
    }

    // Find the team by team code
    const team = await TeamModel.findOne({ teamCode });
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Check if the team has already reached the member limit
    if (team.teamMembers.length >= 4) {  //throwinng error with '==='
      return NextResponse.json(
        { message: "You cannot add more members to the team." },
        { status: 400 }
      );
    }

    // Find the user by user ID
    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Check if the user is already part of the team
    if (team.teamMembers.includes(user._id)) {
      return NextResponse.json(
        { message: "You are already part of this team." },
        { status: 400 }
      );
    }

    // Add the user to the team's `teamMembers` array
    team.teamMembers.push(user._id);
    await team.save();

    // Update the user's team information
    user.event1TeamId = team._id;
    user.event1TeamRole = 1; // Set user role to member

    // Update the `events` array by adding event 1
    if (!user.events.includes(1)) {
      user.events.push(1);
    }
    await user.save();

    return NextResponse.json(
      { message: "Successfully joined the team." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining team:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
