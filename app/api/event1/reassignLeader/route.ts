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
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { newLeaderIndex } = await request.json();

    console.log(newLeaderIndex);

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

    const updatedMembers = team.teamMembers
    .filter(
      (member) => member.toString() !== currentLeader._id.toString() && member.toString() !== newLeaderId.toString()
    )

    updatedMembers.unshift(newLeaderId);

    console.log(updatedMembers)

    await TeamModel.findByIdAndUpdate(
      team._id,
      {
        $set: {
          teamLeaderId: newLeader._id,
          teamLeaderName: newLeader.name,
          teamLeaderEmail: newLeader.email,
          teamMembers: updatedMembers,
        },
      }
    );

    await Users.findByIdAndUpdate(currentLeader._id, {
      $set: { event1TeamId: null, event1TeamRole: null},
    });

    await Users.findByIdAndUpdate(newLeaderId, {
      $set: { event1TeamRole: 0 },
    })

    await Users.updateMany(
      { _id: { $in: updatedMembers } },
      { $set: { event1TeamId: team._id } }
    );

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
