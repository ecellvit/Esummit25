import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { memberIdToRemove } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(memberIdToRemove)) {
      return NextResponse.json({ message: "Invalid member ID" }, { status: 400 });
    }

    // Find the team leader
    const leader = await Users.findOne({ email: sessionUser.email });
    if (!leader) {
      return NextResponse.json({ message: "Leader not found" }, { status: 404 });
    }

    // Ensure user is a team leader
    if (leader.event1TeamRole !== 0 || !leader.event1TeamId) {
      return NextResponse.json({ message: "User is not a team leader or has no team" }, { status: 403 });
    }

    // Fetch the leader's team
    const team = await TeamModel.findById(leader.event1TeamId);
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Ensure the leader actually leads this team
    if (team.teamLeaderId.toString() !== leader._id.toString()) {
      return NextResponse.json({ message: "User is not the leader of this team" }, { status: 403 });
    }

    // Ensure the member exists in the team
    if (!team.teamMembers.some(id => id.toString() === memberIdToRemove.toString())) {
      return NextResponse.json({ message: "Member not found in the team" }, { status: 404 });
    }

    // Ensure at least 1 member remains in the team
    if (team.teamMembers.length <= 1) {
      return NextResponse.json({ message: "Cannot remove the last team member" }, { status: 400 });
    }

    // Remove the member from the team
    const updatedTeam = await TeamModel.findByIdAndUpdate(team._id, {
      $pull: { teamMembers: memberIdToRemove }
    }, { new: true }).exec();

    console.log("Updated Team:", updatedTeam);

    // Remove the user's team reference
    await Users.findByIdAndUpdate(memberIdToRemove, {
      $unset: { event1TeamId: "", event1TeamRole: "" }
    });

    return NextResponse.json({ message: "Member removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
