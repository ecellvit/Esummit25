import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  await dbConnect(); // Connect to the database
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
    const teamId = user.event1TeamId; // Get the teamId from the query string

    // Check if the teamId is provided in the request
    if (!teamId) {
      return NextResponse.json(
        { message: "User is not a part of any team." },
        { status: 400 }
      );
    }

    // Fetch the team using the provided teamId
    const team = await TeamModel.findById(teamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Fetch the team members details using the teamMembers array
    const teamMembers = await Users.find(
      { _id: { $in: team.teamMembers } },
      "name email regNo mobNo event1TeamRole"
    );

    // team members check to be asked
    if (!teamMembers || teamMembers.length === 0) {
      return NextResponse.json(
        { message: "No team members found." },
        { status: 404 }
      );
    }

    // Return the team details including the leader and members
    const teamDetails = {
      teamName: team.teamName,
      teamMembersData: teamMembers, // Members details
    };

    return NextResponse.json(teamDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
