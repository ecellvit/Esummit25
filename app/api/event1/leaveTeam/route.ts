import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function PATCH(request: Request): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const { email } = await request.json();
    console.log('Received email:', email);

    if (!email) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 403 });
    }

    const team: Team | null = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "No team associated with the user" }, { status: 405 });
    }

    // Check if the user is the leader
    if (user.event1TeamRole === 0) {
      const otherMembers = team.teamMembers.filter(memberId => memberId.toString() !== user._id.toString());

      if (otherMembers.length === 0) {
        // If no other members exist, delete the team and allow the leader to leave
        await TeamModel.findByIdAndDelete(team._id);
        
        user.event1TeamId = null;
        user.event1TeamRole = undefined;
        await user.save();

        return NextResponse.json({ success: true, message: "Team disbanded successfully" }, { status: 200 });
      }

      // Assign new leader from the remaining members
      const newLeaderId = otherMembers[0];
      const newLeaderUser = await Users.findById(newLeaderId);

      if (!newLeaderUser) {
        return NextResponse.json({ success: false, message: "Could not assign a new leader" }, { status: 407 });
      }

      newLeaderUser.event1TeamRole = 0; // Set new leader
      await newLeaderUser.save();

      team.teamMembers = otherMembers;
      await team.save();

      user.event1TeamId = null;
      user.event1TeamRole = undefined;
      await user.save();

      return NextResponse.json({ success: true, message: "User left successfully, new leader assigned" }, { status: 200 });
    }

    // If the user is not a leader, simply remove them
    team.teamMembers = team.teamMembers.filter(memberId => memberId.toString() !== user._id.toString());
    await team.save();

    user.event1TeamId = null;
    user.event1TeamRole = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "User left successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in leave team API:", error);
    return NextResponse.json({ success: false, message: "User could not leave the team" }, { status: 500 });
  }
}