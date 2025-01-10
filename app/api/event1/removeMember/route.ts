import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; // Adjust the path to your database connection
import { Users } from "@/models/user.model"; // Adjust paths based on your project structure
import TeamModel from "@/models/event1/Team.model"; // Adjust paths based on your project structure

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  await dbConnect(); // Ensure the database is connected

  try {
    const { memberId } = await req.json(); // Get the memberId to remove from the request

    // Validate input
    if (!memberId) {
      return NextResponse.json(
        { message: "Member ID is required." },
        { status: 400 }
      );
    }

    // Assuming you get the current leaderId from a session or JWT
    // For example, here we use `req.userId` to represent the authenticated leader's ID.
    const leaderId = req.userId; // Replace this with your actual logic to get the leader's ID from the session or JWT

    if (!leaderId) {
      return NextResponse.json(
        { message: "Leader ID is required." },
        { status: 400 }
      );
    }

    // Find the leader user by leaderId
    const leader = await Users.findById(leaderId);
    if (!leader) {
      return NextResponse.json(
        { message: "Leader not found." },
        { status: 404 }
      );
    }

    // Check if the leader is indeed the leader of a team
    if (leader.event1TeamRole !== 0) {
      return NextResponse.json(
        { message: "You are not the leader of any team." },
        { status: 403 }
      );
    }

    // Check if the leader has a valid team ID
    if (!leader.event1TeamId) {
      return NextResponse.json(
        { message: "Leader does not belong to any team." },
        { status: 404 }
      );
    }

    // Find the team by the team ID stored in the leader's event1TeamId
    const team = await TeamModel.findById(leader.event1TeamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Check if the memberId exists in the team
    const memberIndex = team.teamMembers.indexOf(memberId);
    if (memberIndex === -1) {
      return NextResponse.json(
        { message: "Member not found in the team." },
        { status: 404 }
      );
    }

    // Remove the member from the teamMembers array using the index
    team.teamMembers.splice(memberIndex, 1);
    await team.save();

    // Update the user's event1TeamId and event1TeamRole (remove them from the team)
    const member = await Users.findById(memberId);
    if (member) {
      member.event1TeamId = null;
      member.event1TeamRole = 1; // Set role back to 1 (since they are no longer in the team)
      await member.save();
    }

    return NextResponse.json(
      { message: "Member removed successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
