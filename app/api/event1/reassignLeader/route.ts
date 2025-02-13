import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH( request: Request ): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    console.log('hhhhhhhhhh');
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { newLeaderIndex } = await request.json();

    // Find the current user (current leader)
    const currentLeader = await Users.findOne({ email: sessionUser.email });
    if (!currentLeader) {
      return NextResponse.json(
        { success: false, message: "Current leader not found" },
        { status: 404 }
      );
    }

    // Ensure the current user is the leader
    if (currentLeader.event1TeamRole !== 0 || !currentLeader.event1TeamId) {
      return NextResponse.json(
        { success: false, message: "User is not a team leader" },
        { status: 400 }
      );
    }

    // Find the team associated with the current leader
    const team: Team | null = await TeamModel.findById(currentLeader.event1TeamId);
    if (!team) {
      return NextResponse.json(
        { success: false, message: "No team associated with the user" },
        { status: 404 }
      );
    }

    // Check if the new leader index is valid
    if (!team.teamMembers[newLeaderIndex]) {
      return NextResponse.json(
        { success: false, message: "Invalid new leader index" },
        { status: 400 }
      );
    }

    // Get the new leader's user ID
    const newLeaderId = team.teamMembers[newLeaderIndex];

    // Find the new leader in the Users collection
    const newLeader = await Users.findById(newLeaderId);
    if (!newLeader) {
      return NextResponse.json(
        { success: false, message: "New leader not found" },
        { status: 404 }
      );
    }

    // Ensure the new leader is unique in the team
    if (
      team.teamMembers.filter(
        (memberId) => memberId.toString() === newLeaderId.toString()
      ).length !== 1
    ) {
      return NextResponse.json(
        { success: false, message: "New leader ID is not unique in the team" },
        { status: 400 }
      );
    }

    // Reassign the leader role
    newLeader.event1TeamRole = 0; // Leader role
    newLeader.event1TeamId = team._id; // Associate with the team
    await newLeader.save();

    // Update the team's leader details
    team.teamLeaderId = newLeader._id;
    team.teamLeaderName = newLeader.name;
    team.teamLeaderEmail = newLeader.email;

    // Remove the current leader's association with the team
    currentLeader.event1TeamRole = null;
    currentLeader.event1TeamId = null;
    await currentLeader.save();

    // Remove the current leader from the teamMembers array
    team.teamMembers = team.teamMembers.filter(
      (memberId) => memberId.toString() !== currentLeader._id.toString()
    );

    // Save the team changes
    await team.save();

    return NextResponse.json(
      { success: true, message: "Team leader reassigned successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reassigning team leader:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while reassigning the leader" },
      { status: 500 }
    );
  }
}
