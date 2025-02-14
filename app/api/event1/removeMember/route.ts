import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { index } = await req.json();
    if (!index) {
      return NextResponse.json({ success: false, message: "Member index is required" }, { status: 400 });
    }

    // Find the leader
    const leader = await Users.findOne({ email: sessionUser.email });
    if (!leader) {
      return NextResponse.json({ success: false, message: "Leader not found" }, { status: 404 });
    }

    if (leader.event1TeamRole !== 0 || !leader.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not a team leader" }, { status: 403 });
    }

    // Find the team
    const team = await TeamModel.findById(leader.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Ensure the team has members
    if (!team.teamMembers || team.teamMembers.length === 0) {
      return NextResponse.json({ success: false, message: "No members in the team" }, { status: 400 });
    }

    // Check if the leader is removing themselves
    if ( index === 0 ) {
      return NextResponse.json({ success: false, message: "leader cannot leave" }, { status: 412 });
    } 

    const removedMemberId = team.teamMembers[index];
    if (!removedMemberId) {
      return NextResponse.json({ success: false, message: "Invalid member index" }, { status: 400 });
    }

    const removedMember = await Users.findById(removedMemberId)
    if (!removedMember) {
      return NextResponse.json({ success: false, message: "Removed member not found" }, { status: 404 });
    }

    //TODO: check if it works with undefined
    removedMember.event1TeamId = null;
    removedMember.event1TeamRole = null;
    await removedMember.save();

    // Remove the member
    team.teamMembers.splice(index, 1);
    await team.save();

    return NextResponse.json({ success: true, message: "Member removed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}