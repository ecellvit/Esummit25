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
    
    // Find the user
    const user = await Users.findOne({ email: sessionUser.email });
    const userId = user._id.toString();
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    
    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 400 });
    }
    
    if ( sessionUser.event1TeamRole === 0 ) {
      return NextResponse.json({ success: false, message: "Leader cannot leave the team" }, { status: 403 });
    }
    
    // Find the team
    const team = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "Team not found" }, { status: 404 });
    }

    // Remove the user from the team
    team.teamMembers = team.teamMembers.filter((member) => member.toString() !== userId);
    await team.save();

    //TODO: These values could be changed to undefined, check if that works
    user.event1TeamId = null;
    user.event1TeamRole = null;
    await user.save();

    return NextResponse.json({ success: true, message: "User left the team successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error in leave team:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}