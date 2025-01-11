import { dbConnect } from "@/lib/dbConnect";
import TeamModel, { Team } from "@/models/event1/Team.model";
import { Users } from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function PATCH(request: Request): Promise<NextResponse<ApiResponse>> {
  await dbConnect();

  try {
    const { email } = await request.json();

    const user = await Users.findOne({ email: email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    //? User does not have an event1teamId
    if (!user.event1TeamId) {
      return NextResponse.json({ success: false, message: "User is not part of a team" }, { status: 400 });
    }

    //? If user is the team leader, he/she cannot leave the team
    if (user.event1TeamRole == 0) {
      return NextResponse.json({ success: false, message: "Cannot leave team as team leader" }, { status: 400 });
    }

    const team: Team | null = await TeamModel.findById(user.event1TeamId);
    if (!team) {
      return NextResponse.json({ success: false, message: "No team assocated with the user" }, { status: 404 });
    }

    //? Remove the user._id from the members array
    team.teamMembers = team.teamMembers.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );

    team.save();

    //? Remove the user's associations with the team
    user.event1TeamId = null;
    delete user.event1TeamRole;
    await user.save();

    return NextResponse.json({ success: true, message: "User left successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "User could not leave the team" }, { status: 500 });
  }
}