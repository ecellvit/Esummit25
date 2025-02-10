import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(request: Request): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user;
    
    if (!session || !sessionUser) {
      return NextResponse.json({success: false, message: "User not authenticated"}, {status: 401});
    }

    const user = await Users.findOne({ email: sessionUser.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // If user does not have a team association
    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 400 });
    }

    const team: Team | null = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "No team associated with the user" }, { status: 404 });
    }

    // If the user is the team leader, they cannot leave without assigning a new leader
    if (user.event1TeamRole === 0) {
      // Find a new member to assign as the leader
      const newLeader = team.teamMembers.find(memberId => memberId.toString() !== user._id.toString());
      if (!newLeader) {
        return NextResponse.json({ success: false, message: "No other team members to assign as leader" }, { status: 400 });
      }

      // Assign the new leader (take the first available member)
      const newLeaderUser = await Users.findById(newLeader);
      if (newLeaderUser) {
        newLeaderUser.event1TeamRole = 0; // New leader
        await newLeaderUser.save();
        
        // Update the team to reflect the new leader
        team.teamMembers = team.teamMembers.filter(memberId => memberId.toString() !== user._id.toString());
        team.save();

        // Remove the user's association with the team
        user.event1TeamId = null;
        user.event1TeamRole = null;
        await user.save();

        return NextResponse.json({ success: true, message: "User left successfully, new leader assigned" }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, message: "Could not find new leader" }, { status: 404 });
      }
    }

    // If the user is not a leader, just remove them from the team
    team.teamMembers = team.teamMembers.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await team.save();

    user.event1TeamId = null;
    user.event1TeamRole = null;
    await user.save();

    return NextResponse.json({ success: true, message: "User left successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "User could not leave the team" }, { status: 500 });
  }
}
