import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import TeamModel from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const { memberIndexToRemove } = await req.json();

    // Validate leader existence
    const leader = await Users.findOne({ email: sessionUser.email });
    if (!leader) {
      return NextResponse.json(
        { message: "Leader not found" },
        { status: 404 }
      );
    }

    // Ensure leader has a valid role and is assigned to a team
    if (leader.event1TeamRole !== 0) {
      return NextResponse.json(
        { message: "User is not a team leader" },
        { status: 420 }
      );
    }
    if (!leader.event1TeamId) {
      return NextResponse.json(
        { message: "Leader has no team assigned" },
        { status: 419 }
      );
    }

    // Convert event1TeamId to ObjectId if necessary
    // const event1Id = TeamModel.findById(leader.event1TeamId)
    // console.log("Leader's Team ID:", event1Id);

    // Fetch the leader's team

    // const userrr = await Users.find();
    // console.log('jddddddddddddddddddddddddd',userrr);

    const teams = await TeamModel.find();
    console.log("jjjjjjjjjjjjjjjjjjjjjjj", teams);
    console.log(".........................", leader.event1TeamId);
    const team = await TeamModel.findOne({ _id: leader.event1TeamId });
    console.log("Team Found:", team);
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Ensure the leader matches the team's leader
    if (team.teamLeaderId.toString() !== leader._id.toString()) {
      return NextResponse.json(
        { message: "User is not the leader of this team" },
        { status: 403 }
      );
    }

    // Check if index is valid
    if (
      memberIndexToRemove < 0 ||
      memberIndexToRemove >= team.teamMembers.length
    ) {
      return NextResponse.json(
        { message: "Invalid member index" },
        { status: 400 }
      );
    }

    // Ensure the team does not have fewer than 1 member after removal
    if (team.teamMembers.length <= 1) {
      return NextResponse.json(
        { message: "Cannot remove the last team member" },
        { status: 400 }
      );
    }

    // Get the member ID to remove
    const memberIdToRemove = team.teamMembers[memberIndexToRemove];

    // Fetch and update the removed member's data
    const removedMember = await Users.findById(memberIdToRemove);
    if (!removedMember) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }
    // Remove the member from the team
    team.teamMembers.splice(memberIndexToRemove, 1);
    await team.save();

    removedMember.event1TeamId = null;
    removedMember.event1TeamRole = null;
    await removedMember.save();

    return NextResponse.json(
      { message: "Member removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
