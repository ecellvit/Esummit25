import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";

export async function GET(req: Request) {
  try {
    await dbConnect(); // Connect to the database
    const url = new URL(req.url);
    const teamId = url.searchParams.get("teamId"); // Get the teamId from the query string

    // Check if the teamId is provided in the request
    if (!teamId) {
      return NextResponse.json(
        { message: "Team ID is required." },
        { status: 400 }
      );
    }

    // Fetch the team using the provided teamId
    const team = await TeamModel.findById(teamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }
    // Fetch the team leader details using teamLeaderId
    const teamLeader = await Users.findById(
      team.teamLeaderId,
      "name email regNo mobNo event1TeamRole"
    );
    if (!teamLeader) {
      return NextResponse.json(
        { message: "Team leader not found." },
        { status: 404 }
      );
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
      teamLeader: teamLeader, // Leader details
      teamMembersData: teamMembers, // Members details
    };

    return NextResponse.json(teamDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
