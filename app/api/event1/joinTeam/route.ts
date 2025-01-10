import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; // Adjust the path to your database connection
import { Users } from "@/models/user.model"; // Adjust paths based on your project structure
import TeamModel from "@/models/event1/Team.model";

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect(); // Ensure the database is connected

  try {
    const { userId, teamCode } = await req.json();

    // Validate input
    if (!userId || !teamCode) {
      return NextResponse.json(
        { message: "User ID and Team Code are required." },
        { status: 400 }
      );
    }

    // Find the team by team code
    const team = await TeamModel.findOne({ teamCode });
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Find the user by user ID
    const user = await Users.findById(userId);
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

    // Push the user to the team's `teamMembers` array
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
