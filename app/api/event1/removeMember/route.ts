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
      console.log(" ERROR: User not authenticated");
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const { memberIdToRemove } = await req.json();
    console.log(" Received memberIdToRemove:", memberIdToRemove);

    // Ensure memberIdToRemove is a valid number
    const memberIndex = parseInt(memberIdToRemove, 10);
    
    // Find the team leader
    const leader = await Users.findOne({ email: sessionUser.email });
    if (!leader) {
      console.log(" ERROR: Leader not found in database");
      return NextResponse.json({ message: "Leader not found" }, { status: 404 });
    }

    if (leader.event1TeamRole !== 0 || !leader.event1TeamId) {
      console.log(" ERROR: User is not a team leader");
      return NextResponse.json({ message: "User is not a team leader" }, { status: 403 });
    }

    // Fetch the team
    const team = await TeamModel.findById(leader.event1TeamId);
    if (!team) {
      console.log(" ERROR: Team not found");
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // Ensure teamMembers array exists
    if (!team.teamMembers || team.teamMembers.length === 0) {
      console.log(" ERROR: Team has no members"); 
      return NextResponse.json({ message: "No members in the team" }, { status: 400 });
    }


    console.log(" Member found, proceeding to remove:", team.teamMembers[memberIndex]);

    // Remove the member using index
    const removedMember = team.teamMembers.splice(memberIndex, 1);
    await team.save();

    console.log(" Updated Team:", team);

    // Remove the user's team reference
    await Users.findByIdAndUpdate(removedMember[0], {
      $unset: { event1TeamId: "", event1TeamRole: "" }
    });

    return NextResponse.json({ message: "Member removed successfully" }, { status: 200 });
  } catch (error) {
    console.error(" ERROR: Internal Server Error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
