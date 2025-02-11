import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { memberIdToRemove } = await req.json();
    if (!memberIdToRemove) {
      return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
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
    const isLeaderLeaving = team.teamLeaderId.toString() === memberIdToRemove;

    // Remove the member
    team.teamMembers = team.teamMembers.filter((member) => member.toString() !== memberIdToRemove);
    
    // If leader is leaving and there are remaining members, assign a new leader
    if (isLeaderLeaving && team.teamMembers.length > 0) {
      team.teamLeaderId = team.teamMembers[0]; // Assign the first member as leader
      await Users.findByIdAndUpdate(team.teamMembers[0], { event1TeamRole: 0 });
    }

    // If no members remain, delete the team
    if (team.teamMembers.length === 0) {
      await TeamModel.findByIdAndDelete(team._id);
      await Users.findByIdAndUpdate(memberIdToRemove, { $unset: { event1TeamId: "", event1TeamRole: "" } });
      return NextResponse.json({ success: true, message: "Team deleted as no members are left" }, { status: 200 });
    }

    // Save the updated team
    await team.save();

    // Update the removed user's details
    await Users.findByIdAndUpdate(memberIdToRemove, { $unset: { event1TeamId: "", event1TeamRole: "" } });

    return NextResponse.json({ success: true, message: "Member removed successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}