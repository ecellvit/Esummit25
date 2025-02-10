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
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 400 });
    }

    // Find the team
    const team = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Check if the user is the leader
    const isLeaderLeaving = team.teamLeaderId.toString() === userId;

    // Remove the user from the team
    team.teamMembers = team.teamMembers.filter((member) => member.toString() !== userId);

    // If leader leaves and there are remaining members, assign new leader
    if (isLeaderLeaving && team.teamMembers.length > 0) {
      team.teamLeaderId = team.teamMembers[0]; // Assign the first member as new leader
      await Users.findByIdAndUpdate(team.teamMembers[0], { event1TeamRole: 0 });
    }

    // If no members remain, delete the team
    if (team.teamMembers.length === 0) {
      await TeamModel.findByIdAndDelete(team._id);
      await Users.findByIdAndUpdate(userId, { $unset: { event1TeamId: "", event1TeamRole: "" } });
      return NextResponse.json({ success: true, message: "Team deleted as no members are left" }, { status: 200 });
    }

    // Save the updated team
    await team.save();

    // Remove user’s association with the team
    await Users.findByIdAndUpdate(userId, { $unset: { event1TeamId: "", event1TeamRole: "" } });

    return NextResponse.json({ success: true, message: "User left the team successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in leave team:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}